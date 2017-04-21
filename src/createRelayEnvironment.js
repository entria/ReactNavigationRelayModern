/**
 * @flow
 */
const {
  Environment,
  Network,
  RecordSource,
  Store,
  ConnectionHandler,
  ViewerHandler,
} = require('relay-runtime');

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, cacheConfig, uploadables) {
  return fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);

const source = new RecordSource();
const store = new Store(source);

const handleProvider = (handle) => {
  switch (handle) {
    // Augment (or remove from) this list:
    case 'connection': return ConnectionHandler;
    case 'viewer': return ViewerHandler;
  }
  throw new Error(
    `handlerProvider: No handler provided for ${handle}`
  );
};

const env = new Environment({
  handleProvider,
  network,
  store,
});

export default env;
