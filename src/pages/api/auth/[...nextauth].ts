import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import LinkedIn from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import signinMutations from 'constants/GraphQL/SignIn/mutations';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/404', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/user/welcome', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in with OTP',

      credentials: {
        email: {label: 'Email', type: 'text', placeholder: 'jsmith@example.com'},
        otpToken: {label: 'OTP Token', type: 'text', placeholder: '********'},
      },
      async authorize(credentials) {
        try {
          const {data} = await graphqlRequestHandler(
            signinMutations.validateOtp,
            {
              email: credentials?.email,
              otpToken: credentials?.otpToken,
            },
            process.env.BACKEND_API_KEY
          );

          if (data.data.validateOtp.response.status === 200) {
            const {email, name} = data.data.validateOtp;
            return {email, name};
          }

          return null;
        } catch (err) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    LinkedIn({
      id: 'linkedin',
      name: 'LinkedIn',
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      authorization: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        params: {scope: 'r_liteprofile r_emailaddress'},
      },
      accessTokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      token: 'https://www.linkedin.com/oauth/v2/accessToken',
      requestTokenUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      userinfo: {
        url: 'https://api.linkedin.com/v2/me',
        params: {
          projection: `(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))`,
        },
      },
      async profile(profile, tokens) {
        const emailResponse = await fetch(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          {headers: {Authorization: `Bearer ${tokens.access_token}`}}
        );
        const emailData = await emailResponse.json();
        return {
          id: profile.id,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          email: emailData?.elements?.[0]?.['handle~']?.emailAddress,
          image:
            profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({user}) {
      const {data} = await graphqlRequestHandler(
        signinMutations.handleSignIn,
        {
          email: user.email,
          name: user.name,
        },
        process.env.BACKEND_API_KEY
      );
      const token = data.data.handleSignIn.message;
      user.accessToken = token;
      return true;
    },
    async jwt({token, user}) {
      if (user) {
        token = {
          accessToken: user.accessToken,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },

    async session({session, token}) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
