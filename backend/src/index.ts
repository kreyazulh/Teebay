import 'dotenv/config';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import cors from 'cors';
import { prisma } from './database/client';
import { generateToken, hashPassword, comparePassword, validateEmail, validatePassword, getUserFromToken } from './utils/auth';

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// GraphQL schema
const typeDefs = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    address: String!
    phoneNumber: String!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    categories: [String!]!
    price: Float!
    rentPrice: Float!
    rentType: RentType!
    purchasePrice: Float!
    owner: User!
    ownerId: String!
    datePosted: String!
    views: Int!
    isAvailable: Boolean!
    transactions: [Transaction!]!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: ID!
    product: Product!
    productId: String!
    buyer: User!
    buyerId: String!
    seller: User!
    sellerId: String!
    type: TransactionType!
    price: Float!
    rentStartDate: String
    rentEndDate: String
    status: TransactionStatus!
    createdAt: String!
    updatedAt: String!
  }

  enum TransactionType {
    PURCHASE
    RENT
  }

  enum TransactionStatus {
    PENDING
    CONFIRMED
    COMPLETED
    CANCELLED
  }

  enum RentType {
    PER_HOUR
    PER_DAY
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    address: String!
    phoneNumber: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProductInput {
    title: String!
    description: String!
    categories: [String!]!
    price: Float!
    rentPrice: Float!
    rentType: RentType!
  }

  type Query {
    hello: String!
    me: User
    products: [Product!]!
    product(id: ID!): Product
    myProducts: [Product!]!
    myTransactions: [Transaction!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    buyProduct(productId: ID!): Transaction!
    rentProduct(productId: ID!, startDate: String!, endDate: String!): Transaction!
  }
`;

// Resolvers
const resolvers = {
  hello: () => 'Hello from GraphQL!',
  
  me: async (args: any, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    return await prisma.user.findUnique({
      where: { id: context.user.userId }
    });
  },

  products: async (args: any, context: any) => {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        owner: true,
        transactions: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return products;
  },

  product: async ({ id }: { id: string }, context: any) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        owner: true,
        transactions: true
      }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },

  myProducts: async (args: any, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    return await prisma.product.findMany({
      where: { ownerId: context.user.userId },
      include: {
        owner: true,
        transactions: {
          include: {
            buyer: true,
            seller: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  myTransactions: async (args: any, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    console.log('Fetching transactions for user:', context.user.userId);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: context.user.userId },
          { sellerId: context.user.userId }
        ]
      },
      include: {
        product: { include: { owner: true } },
        buyer: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Found transactions:', transactions.length);
    return transactions;
  },

  createProduct: async ({ input }: { input: any }, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    const { title, description, categories, price, rentPrice, rentType } = input;
    
    const product = await prisma.product.create({
      data: {
        title,
        description,
        categories,
        price,
        rentPrice,
        rentType,
        purchasePrice: price,
        ownerId: context.user.userId,
        views: 0,
        isAvailable: true,
        datePosted: new Date()
      },
      include: {
        owner: true,
        transactions: true
      }
    });
    
    return product;
  },

  updateProduct: async ({ id, input }: { id: string; input: any }, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    if (existingProduct.ownerId !== context.user.userId) {
      throw new Error('Not authorized to update this product');
    }
    
    const { title, description, categories, price, rentPrice, rentType } = input;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        categories,
        price,
        rentPrice,
        rentType,
        purchasePrice: price
      },
      include: {
        owner: true,
        transactions: true
      }
    });
    
    return product;
  },

  deleteProduct: async ({ id }: { id: string }, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    if (existingProduct.ownerId !== context.user.userId) {
      throw new Error('Not authorized to delete this product');
    }
    
    await prisma.product.delete({
      where: { id }
    });
    
    return true;
  },

  buyProduct: async ({ productId }: { productId: string }, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { owner: true }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.ownerId === context.user.userId) {
      throw new Error('Cannot buy your own product');
    }
    
    if (!product.isAvailable) {
      throw new Error('Product is not available');
    }
    
    // Create transaction and mark product as sold
    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          type: 'PURCHASE',
          price: product.price,
          productId,
          buyerId: context.user.userId,
          sellerId: product.ownerId,
          status: 'CONFIRMED'
        },
        include: {
          product: { include: { owner: true } },
          buyer: true,
          seller: true
        }
      }),
      prisma.product.update({
        where: { id: productId },
        data: { isAvailable: false }
      })
    ]);
    
    return transaction;
  },

  rentProduct: async (
    { productId, startDate, endDate }: { productId: string; startDate: string; endDate: string },
    context: any
  ) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { owner: true }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.ownerId === context.user.userId) {
      throw new Error('Cannot rent your own product');
    }
    
    if (!product.isAvailable) {
      throw new Error('Product is not available');
    }
    
    // Convert string dates to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Validate dates
    if (startDateObj >= endDateObj) {
      throw new Error('Start date must be before end date');
    }
    
    if (startDateObj < new Date()) {
      throw new Error('Start date cannot be in the past');
    }
    
    // Check for rent overlap
    const overlappingRents = await prisma.transaction.findMany({
      where: {
        productId,
        type: 'RENT',
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            rentStartDate: { lte: endDateObj },
            rentEndDate: { gte: startDateObj }
          }
        ]
      }
    });
    
    if (overlappingRents.length > 0) {
      throw new Error('Product is already rented for the selected dates');
    }
    
    // Calculate rent duration and total price
    const duration = endDateObj.getTime() - startDateObj.getTime();
    const hours = duration / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    
    let totalPrice: number;
    if (product.rentType === 'PER_HOUR') {
      totalPrice = product.rentPrice * hours;
    } else {
      totalPrice = product.rentPrice * days;
    }
    
    const transaction = await prisma.transaction.create({
      data: {
        type: 'RENT',
        price: totalPrice,
        rentStartDate: startDateObj,
        rentEndDate: endDateObj,
        productId,
        buyerId: context.user.userId,
        sellerId: product.ownerId,
        status: 'CONFIRMED'
      },
      include: {
        product: { include: { owner: true } },
        buyer: true,
        seller: true
      }
    });
    
    return transaction;
  },

  register: async ({ input }: { input: any }, context: any) => {
    const { firstName, lastName, email, password, address, phoneNumber } = input;
    
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
    }
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        phoneNumber
      }
    });
    
    const token = generateToken(user);
    
    return { token, user };
  },

  login: async ({ input }: { input: any }, context: any) => {
    const { email, password } = input;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const isValid = await comparePassword(password, user.password);
    
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateToken(user);
    
    return { token, user };
  },
};

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL');

    // Create Express app
    const app = express();

    // Enable CORS
    app.use(cors({
      origin: CORS_ORIGIN,
      credentials: true
    }));

    // Parse JSON
    app.use(express.json());

    // Create GraphQL schema
    const schema = buildSchema(typeDefs);

    // GraphQL endpoint
    app.use('/graphql', createHandler({
      schema,
      rootValue: resolvers,
      context: (req: any) => {
        console.log('Context function called');
        console.log('Request headers:', req.headers);
        
        // Extract token and get user
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        console.log('Extracted token:', token);
        
        const user = getUserFromToken(token);
        console.log('User from token:', user);
        
        return {
          req,
          prisma,
          user
        };
      },
    }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Teebay Backend is running with PostgreSQL!' });
    });

    // Test endpoint
    app.get('/test', (req, res) => {
      res.json({ message: 'Backend is working!' });
    });

    // Start the HTTP server
    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
      console.log(`Health check at http://localhost:${PORT}/health`);
      console.log(`Test endpoint at http://localhost:${PORT}/test`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();