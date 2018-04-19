import { commitMutation, graphql } from 'react-relay';
import Environment from './createRelayEnvironment';

const mutation = graphql`
  mutation RegisterEmailMutation($input: RegisterEmailInput!) {
    RegisterEmail(input: $input) {
      error
      token
    }
  }
`;

function commit(input, onCompleted, onError) {
  return commitMutation(Environment, {
    mutation,
    variables: {
      input,
    },
    onCompleted,
    onError,
  });
}

export default { commit };
