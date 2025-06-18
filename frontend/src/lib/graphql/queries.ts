import { gql } from '@apollo/client';

// Auth Queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
      address
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

// Product Queries
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      title
      description
      categories
      price
      rentPrice
      rentType
      purchasePrice
      owner {
        id
        firstName
        lastName
        email
      }
      ownerId
      datePosted
      views
      isAvailable
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      categories
      price
      rentPrice
      rentType
      purchasePrice
      owner {
        id
        firstName
        lastName
        email
        address
        phoneNumber
      }
      ownerId
      datePosted
      views
      isAvailable
      transactions {
        id
        type
        status
        rentStartDate
        rentEndDate
        buyer {
          id
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_PRODUCTS = gql`
  query GetMyProducts {
    myProducts {
      id
      title
      description
      categories
      price
      rentPrice
      rentType
      purchasePrice
      owner {
        id
        firstName
        lastName
        email
      }
      ownerId
      datePosted
      views
      isAvailable
      transactions {
        id
        type
        status
        buyer {
          id
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
    }
  }
`;

// Transaction Queries
export const GET_MY_TRANSACTIONS = gql`
  query GetMyTransactions {
    myTransactions {
      id
      type
      price
      rentStartDate
      rentEndDate
      status
      product {
        id
        title
        price
        rentPrice
        rentType
        owner {
          id
          firstName
          lastName
        }
      }
      buyer {
        id
        firstName
        lastName
        email
      }
      seller {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_PURCHASES = gql`
  query GetMyPurchases {
    myPurchases {
      id
      type
      price
      status
      product {
        id
        title
        price
        owner {
          id
          firstName
          lastName
        }
      }
      buyer {
        id
        firstName
        lastName
      }
      seller {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;

export const GET_MY_RENTALS = gql`
  query GetMyRentals {
    myRentals {
      id
      type
      price
      rentStartDate
      rentEndDate
      status
      product {
        id
        title
        rentPrice
        rentType
        owner {
          id
          firstName
          lastName
        }
      }
      buyer {
        id
        firstName
        lastName
      }
      seller {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;

// Test Query
export const TEST_QUERY = gql`
  query TestQuery {
    hello
  }
`;