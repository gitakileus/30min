/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import getRawBody from 'raw-body';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import activeExtensionsMutations from 'constants/GraphQL/ActiveExtension/mutations';
import EMAIL_TEMPLATES from 'constants/emailTemplateIDs';
import sendEmail from 'utils/sendEmailHandler';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }
  const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
    apiVersion: '2020-08-27',
  });

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature']!,
      process.env.WEBHOOK_KEY!
    );
    const isSubscription = event.data.object['subscription'] || false;
    let customer;

    if (event.data.object['customer']) {
      customer = await stripe.customers.retrieve(event.data.object['customer']);
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await sendEmail(
          {
            invoiceLink: event.data.object['invoice_pdf'],
            customerName: customer.name,
          },
          customer.email,
          process.env.EMAIL_SERVER_USER!,
          EMAIL_TEMPLATES.EXTENSIONS.PAYMENT_SUCCESS
        );

        // Customer paid Invoice Manually
        if (event.data.object['billing_reason'] === 'manual' && isSubscription) {
          // Update ActiveExtension Status
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: event.data.object['status'],
              },
              subscriptionId: event.data.object['subscription'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );
        }

        // Set Default Payment Method for this Subscription
        if (event.data.object['billing_reason'] === 'subscription_create') {
          const subscriptionId = event.data.object['subscription'];
          const paymentIntentId = event.data.object['payment_intent'];
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

          if (paymentIntent?.payment_method) {
            await stripe.subscriptions.update(subscriptionId, {
              default_payment_method: paymentIntent.payment_method.toString(),
            });
          }

          // Update Status of ActiveExtension
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: event.data.object['status'],
              },
              subscriptionId: event.data.object['subscription'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );
        }
        break;
      case 'invoice.payment_failed':
        if (isSubscription) {
          // Update Status of ActiveExtension
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: 'payment_failed',
              },
              subscriptionId: event.data.object['subscription'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );

          await sendEmail(
            {
              invoiceLink: event.data.object['invoice_pdf'],
              customerName: customer.name,
            },
            customer.email,
            process.env.EMAIL_SERVER_USER!,
            EMAIL_TEMPLATES.EXTENSIONS.PAYMENT_FAILED
          );
        }
        break;
      case 'customer.subscription.updated':
        if (event.data.object['status'] === 'past_due') {
          const invoicePdf = (await stripe.invoices.retrieve(event.data.object['latest_invoice']))
            .invoice_pdf;

          await sendEmail(
            {
              invoiceLink: invoicePdf,
              customerName: customer.name,
            },
            customer.email,
            process.env.EMAIL_SERVER_USER!,
            EMAIL_TEMPLATES.EXTENSIONS.SUBSCRIPTION_PAST_DUE
          );

          // Update Status of ActiveExtension
          await graphqlRequestHandler(
            activeExtensionsMutations.updateActiveExtension,
            {
              activeExtensionData: {
                status: 'past_due',
              },
              subscriptionId: event.data.object['id'],
              customerId: event.data.object['customer'],
            },
            process.env.BACKEND_API_KEY
          );
        }
        break;
      case 'customer.subscription.deleted':
        await sendEmail(
          {
            customerName: customer.name,
          },
          customer.email,
          process.env.EMAIL_SERVER_USER!,
          EMAIL_TEMPLATES.EXTENSIONS.SUBSCRIPTION_CANCELED
        );
        break;
      default:
    }

    res.status(200).json({message: 'webhooks ran'});
  } catch (err) {
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}
