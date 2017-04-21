// @flow
import Relay from 'react-relay/classic';

const ViewerQuery = {
  viewer: () => Relay.QL`
    query {
      viewer
    }
  `,
};

export default ViewerQuery;
