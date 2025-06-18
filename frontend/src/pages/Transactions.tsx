import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { TabProps } from '../components/ui/Tabs';
import { useAuth } from '../lib/context/AuthContext';

const MY_TRANSACTIONS = gql`
  query MyTransactions {
    myTransactions {
      id
      type
      price
      rentStartDate
      rentEndDate
      status
      createdAt
      buyerId
      sellerId
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
      }
      seller {
        id
        firstName
        lastName
      }
    }
  }
`;

const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data, loading, error, refetch } = useQuery(MY_TRANSACTIONS);

  const tabs: TabProps[] = [
    { id: 'all', label: 'All Transactions' },
    { id: 'bought', label: 'Bought' },
    { id: 'sold', label: 'Sold' },
    { id: 'borrowed', label: 'Borrowed' },
    { id: 'lent', label: 'Lent' },
  ];

  const transactions = data?.myTransactions || [];
  console.log('Current user ID:', user?.id);
  console.log('All transactions:', transactions);

  const filteredTransactions = transactions.filter((transaction: any) => {
    console.log('Transaction:', transaction.id, 'Type:', transaction.type, 'BuyerId:', transaction.buyerId, 'SellerId:', transaction.sellerId);
    
    if (activeTab === 'all') return true;
    if (activeTab === 'bought') {
      // Only PURCHASE transactions where user is the buyer
      return transaction.type === 'PURCHASE' && transaction.buyerId === user?.id;
    }
    if (activeTab === 'sold') {
      // Only PURCHASE transactions where user is the seller
      return transaction.type === 'PURCHASE' && transaction.sellerId === user?.id;
    }
    if (activeTab === 'borrowed') {
      // Only RENT transactions where user is the renter (buyer)
      return transaction.type === 'RENT' && transaction.buyerId === user?.id;
    }
    if (activeTab === 'lent') {
      // Only RENT transactions where user is the lender (seller)
      return transaction.type === 'RENT' && transaction.sellerId === user?.id;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Invalid Date';
    }
  };

  if (error) {
    console.error('GraphQL Error:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading transactions: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Transactions</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {tab.id === 'all' ? transactions.length : 
                   transactions.filter((t: any) => {
                     if (tab.id === 'bought') return t.type === 'PURCHASE' && t.buyerId === user?.id;
                     if (tab.id === 'sold') return t.type === 'PURCHASE' && t.sellerId === user?.id;
                     if (tab.id === 'borrowed') return t.type === 'RENT' && t.buyerId === user?.id;
                     if (tab.id === 'lent') return t.type === 'RENT' && t.sellerId === user?.id;
                     return false;
                   }).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'sold' || activeTab === 'lent' ? 'Buyer/Renter' : 'Seller/Owner'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction: any) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.product.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'PURCHASE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {transaction.type === 'PURCHASE' ? 'Purchase' : 'Rental'}
                    </span>
                    {transaction.type === 'RENT' && transaction.rentStartDate && transaction.rentEndDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(transaction.rentStartDate)} - {formatDate(transaction.rentEndDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.sellerId === user?.id
                        ? `${transaction.buyer.firstName} ${transaction.buyer.lastName}`
                        : `${transaction.seller.firstName} ${transaction.seller.lastName}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${transaction.price.toFixed(2)}
                      {transaction.type === 'RENT' &&
                        ` / ${transaction.product.rentType === 'PER_DAY' ? 'day' : 'hour'}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {activeTab === 'all' ? 'No transactions found.' : `No ${activeTab} transactions found.`}
          </p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;