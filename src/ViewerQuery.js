// @flow
import Relay from 'react-relay';

const ViewerQuery = {
  viewer: () => Relay.QL`
    query {
      viewer
    }
  `,
};

export default ViewerQuery;
