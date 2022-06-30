import {gql} from '@apollo/client';

const updateApiFilter = gql`
  mutation UpdateApiFilter($filterConfig: ApiLogFilterConfig, $token: String!) {
    updateApiFilter(filterConfig: $filterConfig, token: $token) {
      message
      status
    }
  }
`;

const mutations = {updateApiFilter};

export default mutations;
