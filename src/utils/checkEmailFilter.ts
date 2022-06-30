import {BW_LIST} from 'constants/enums';
import extensionQueries from 'constants/GraphQL/ActiveExtension/queries';
import ProductIDs from 'constants/stripeProductIDs';
import graphqlRequestHandler from './graphqlRequestHandler';

export default async function checkEmailFilter(
  bookerEmail: string,
  filterType: BW_LIST,
  accessToken: any,
  emailFilter?: [String] | undefined,
  domainFilter?: [String] | undefined
) {
  if (emailFilter?.length || domainFilter?.length) {
    const {data: response} = await graphqlRequestHandler(
      extensionQueries.checkExtensionStatus,
      {productId: ProductIDs.EXTENSIONS.WHITE_BLACK_LIST},
      accessToken
    );

    if (response.data.checkExtensionStatus.isActive) {
      const emailDomain = bookerEmail.split('@')[1];
      const includesEmail = emailFilter?.includes(bookerEmail);
      const includesDomain = domainFilter?.includes(emailDomain);

      if (filterType === BW_LIST.WHITE_LIST && !includesEmail && !includesDomain) {
        return false;
      }

      if (filterType === BW_LIST.BLACK_LIST && (includesEmail || includesDomain)) {
        return false;
      }
    }
  }

  return true;
}
