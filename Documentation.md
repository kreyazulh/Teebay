# Part 4: Technical Documentation - Teebay Application

## Overview

Teebay is a full-stack marketplace application that allows users to buy, sell, and rent products. The application is built using a modern tech stack with a React frontend, Node.js/Express backend with GraphQL API, and PostgreSQL database with Prisma ORM.

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express, GraphQL (graphql-http)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **State Management**: Apollo Client for GraphQL state management
- **Routing**: React Router for client-side routing

### Project Structure
```
sazim/
├── backend/          # Node.js/Express GraphQL API
├── frontend/         # React TypeScript application
└── README.md
```

## Part 1: Backend Implementation

### Database Schema Design

The application uses a structured PostgreSQL schema with three main entities:

#### User Model
- **Fields**: id, firstName, lastName, email, password, address, phoneNumber, createdAt, updatedAt
- **Relations**: One-to-many with Products (as owner), One-to-many with Transactions (as buyer/seller)
- **Security**: Password hashing using bcrypt

#### Product Model
- **Fields**: id, title, description, categories (array), price, rentPrice, rentType, purchasePrice, views, isAvailable, datePosted, createdAt, updatedAt
- **Relations**: Many-to-one with User (owner), One-to-many with Transactions
- **Features**: Support for both purchase and rental with different pricing models

#### Transaction Model
- **Fields**: id, type (PURCHASE/RENT), price, rentStartDate, rentEndDate, status, createdAt, updatedAt
- **Relations**: Many-to-one with Product, Many-to-one with User (buyer/seller)
- **Enums**: TransactionType (PURCHASE, RENT), TransactionStatus (PENDING, CONFIRMED, COMPLETED, CANCELLED), RentType (PER_HOUR, PER_DAY)

### GraphQL API Implementation

The backend implements a GraphQL API with the following key features:

#### Authentication System
- **JWT Token Generation**: Secure token creation using user ID and email
- **Password Security**: bcrypt hashing with salt rounds for password storage
- **Input Validation**: Email format validation and password strength requirements
- **Context-based Authentication**: Token extraction from Authorization header

#### Core Resolvers

**Query Resolvers:**
- `hello`: Simple health check endpoint (for internal testing to see if the backend is running)
- `me`: Get current authenticated user
- `products`: Fetch all available products with owner and transaction data
- `product(id)`: Get specific product by ID
- `myProducts`: Get products owned by current user
- `myTransactions`: Get all transactions where user is buyer or seller

**Mutation Resolvers:**
- `register`: User registration with validation
- `login`: User authentication with password verification
- `createProduct`: Create new product listing
- `updateProduct`: Update existing product (owner-only)
- `deleteProduct`: Delete product (owner-only)
- `buyProduct`: Purchase product with automatic availability update
- `rentProduct`: Rent product with date validation and overlap checking

#### Business Logic Implementation

**Product Management:**
- Automatic product availability management
- Owner-only edit/delete permissions
- Category-based filtering support
- View tracking capability

**Transaction Processing:**
- Purchase transactions automatically mark products as unavailable
- Rental transactions include date range validation
- Overlap checking for rental periods
- Price calculation based on rental duration and type

**Security Features:**
- Input sanitization and validation
- Authorization checks for protected operations
- Error handling with meaningful messages
- CORS configuration for frontend integration

### Corner Cases Handled

1. **Rental Date Overlap**: Prevents double-booking by checking existing rentals
2. **Self-Purchase Prevention**: Users cannot buy or rent their own products
3. **Invalid Date Ranges**: Validates start date is before end date and not in the past
4. **Product Availability**: Ensures products are available before transaction
5. **Authorization Failures**: Proper error handling for unauthorized operations

## Part 2: Frontend Implementation

### Authentication System

The frontend implements a comprehensive authentication system using React Context:

#### AuthContext Features
- **Token Management**: Automatic token storage in localStorage
- **User State Management**: Centralized user state with loading states
- **Automatic Login**: Token-based session restoration on app reload
- **Logout Functionality**: Complete state cleanup and cache clearing

#### Protected Routes
- **Route Protection**: All main routes require authentication
- **Automatic Redirects**: Unauthenticated users redirected to login
- **Loading States**: Proper loading indicators during authentication checks

### User Interface Components

#### Core Pages
1. **Home Page**: Product browsing with search and category filtering
2. **Login/Register**: User authentication forms with validation
3. **Add Product**: Multi-step product creation form
4. **Product Detail**: Comprehensive product view with purchase/rental options
5. **My Products**: User's product management interface
6. **Transactions**: Transaction history with filtering tabs

#### Component Architecture
- **Reusable UI Components**: Tabs, ProductCard, Form components
- **Layout Components**: MainLayout with navigation
- **Form Components**: Multi-step ProductForm with progress tracking
- **Protected Components**: Authentication-aware components

### State Management

#### Apollo Client Integration
- **GraphQL Operations**: Queries and mutations for all data operations
- **Cache Management**: Automatic cache updates and invalidation
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Loading indicators for all async operations

#### Local State Management
- **React Hooks**: useState and useEffect for component state
- **Form State**: Controlled components with validation
- **Filter State**: Search and category filtering state management

### User Experience Features

#### Product Browsing
- **Search Functionality**: Real-time search across title and description
- **Category Filtering**: Multi-category selection with visual feedback
- **Responsive Design**: Mobile-first responsive layout
- **Loading States**: Skeleton loading and spinner indicators

#### Product Management
- **Multi-step Forms**: Guided product creation process
- **Form Validation**: Client-side validation with error messages
- **Image Placeholders**: Consistent visual design without actual images
- **Edit Functionality**: Full product editing capabilities

#### Transaction Management
- **Tabbed Interface**: Organized transaction viewing by type
- **Date Formatting**: Consistent date display across the application
- **Status Indicators**: Visual status badges for transaction states
- **Filtering**: Transaction filtering by type (bought, sold, borrowed, lent)

## Part 3: Integration and Deployment

### API Integration

#### GraphQL Client Setup
- **Apollo Client Configuration**: Proper setup with authentication headers
- **Error Handling**: Comprehensive error handling for network issues
- **Cache Management**: Efficient caching strategies for performance
- **Type Safety**: TypeScript integration for type-safe GraphQL operations

#### Authentication Flow
- **Token Injection**: Automatic token inclusion in GraphQL requests
- **Token Refresh**: Automatic session restoration on app reload
- **Logout Cleanup**: Complete cache and state cleanup on logout

### Data Flow

#### Frontend to Backend Communication
1. **User Authentication**: Login/register with JWT token response
2. **Product Operations**: CRUD operations with proper authorization
3. **Transaction Processing**: Purchase and rental with validation
4. **Data Fetching**: Efficient data loading with caching

#### Error Handling Strategy
- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: User-friendly error messages
- **Authorization Errors**: Proper redirects for unauthorized access
- **GraphQL Errors**: Structured error handling for API responses

## Technical Challenges and Solutions

### Challenge 1: Rental Date Overlap Prevention
**Problem**: Preventing double-booking of rental items
**Solution**: Implemented database query to check for overlapping rental periods before creating new rental transactions

### Challenge 2: Authentication State Management
**Problem**: Maintaining user session across page refreshes
**Solution**: Combined localStorage token storage with Apollo Client context and automatic token injection

### Challenge 3: Complex Transaction Filtering
**Problem**: Displaying transactions filtered by user role and transaction type
**Solution**: Implemented tabbed interface with dynamic filtering based on user ID and transaction type

### Challenge 4: Form Validation and User Experience
**Problem**: Creating intuitive multi-step forms with validation
**Solution**: Built reusable form components with progress tracking and comprehensive validation

### Challenge 5: Real-time Search and Filtering
**Problem**: Efficient product filtering with multiple criteria
**Solution**: Implemented client-side filtering with search term and category selection

## Performance Considerations

### Database Optimization
- **Indexed Fields**: Proper indexing on frequently queried fields
- **Efficient Queries**: Optimized GraphQL queries with proper field selection
- **Connection Pooling**: Prisma client connection management

### Frontend Performance
- **Code Splitting**: Vite-based build optimization
- **Caching Strategy**: Apollo Client cache management
- **Lazy Loading**: Component-based code splitting where appropriate

## Security Implementation

### Backend Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token generation and validation
- **Input Validation**: Comprehensive input sanitization
- **Authorization**: Role-based access control

### Frontend Security
- **Token Storage**: Secure localStorage usage
- **Input Sanitization**: Client-side validation
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: GraphQL endpoint protection

## Future Enhancements

### Potential Improvements
1. **Real-time Features**: WebSocket integration for live updates
2. **Payment Integration**: Stripe or SSLCommerz integration
3. **Image Upload**: Cloud storage for product images
4. **Notifications**: Email and push notifications
5. **Advanced Search**: Elasticsearch integration
6. **Mobile App**: React Native implementation

### Scalability Considerations
1. **Database Sharding**: For high-volume data
2. **CDN Integration**: For static assets
3. **Microservices**: Service decomposition for complex features
4. **Caching Layer**: Redis for session and data caching