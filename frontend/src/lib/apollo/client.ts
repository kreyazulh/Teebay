// src/lib/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle authentication errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
});

// Cache configuration with proper cache policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        myProducts: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        myTransactions: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        myPurchases: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        myRentals: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Product: {
      fields: {
        views: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to clear cache on logout
export const clearApolloCache = () => {
  apolloClient.clearStore();
};

// Cache management utilities
export const cacheUtils = {
  // Remove product from cache when deleted
  removeProduct: (productId: string) => {
    cache.evict({
      id: cache.identify({ __typename: 'Product', id: productId })
    });
    cache.gc(); // Garbage collect orphaned references
  },

  // Remove transaction from cache when cancelled/deleted
  removeTransaction: (transactionId: string) => {
    cache.evict({
      id: cache.identify({ __typename: 'Transaction', id: transactionId })
    });
    cache.gc();
  },

  // Clear user-specific data on logout
  clearUserData: () => {
    cache.evict({ fieldName: 'me' });
    cache.evict({ fieldName: 'myProducts' });
    cache.evict({ fieldName: 'myTransactions' });
    cache.evict({ fieldName: 'myPurchases' });
    cache.evict({ fieldName: 'myRentals' });
    cache.gc();
  },
};