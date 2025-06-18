import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
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
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
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
  }
`;

// Product Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

// Transaction Mutations
export const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: ID!) {
    buyProduct(productId: $productId) {
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

export const RENT_PRODUCT = gql`
  mutation RentProduct($productId: ID!, $startDate: String!, $endDate: String!) {
    rentProduct(productId: $productId, startDate: $startDate, endDate: $endDate) {
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