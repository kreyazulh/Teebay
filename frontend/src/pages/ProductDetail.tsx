import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Calendar, User, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { GET_PRODUCT } from '../lib/graphql/queries';
import { BUY_PRODUCT, RENT_PRODUCT } from '../lib/graphql/mutations';
import { useAuth } from '../lib/context/AuthContext';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentStartDate, setRentStartDate] = useState('');
  const [rentEndDate, setRentEndDate] = useState('');
  const [error, setError] = useState('');

  // Query to get product details
  const { data, loading, error: queryError } = useQuery(GET_PRODUCT, {
    variables: { id },
    errorPolicy: 'all',
  });

  // Mutations for buy and rent
  const [buyProductMutation] = useMutation(BUY_PRODUCT, {
    onCompleted: () => {
      alert('Product purchased successfully!');
      setShowBuyModal(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const [rentProductMutation] = useMutation(RENT_PRODUCT, {
    onCompleted: () => {
      alert('Product rented successfully!');
      setShowRentModal(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleBuyProduct = async () => {
    try {
      setError('');
      await buyProductMutation({
        variables: { productId: id }
      });
    } catch (error) {
      console.error('Error buying product:', error);
    }
  };

  const handleRentProduct = async () => {
    try {
      setError('');
      if (!rentStartDate || !rentEndDate) {
        setError('Please select both start and end dates');
        return;
      }

      await rentProductMutation({
        variables: {
          productId: id,
          startDate: rentStartDate,
          endDate: rentEndDate
        }
      });
    } catch (error) {
      console.error('Error renting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (queryError || !data?.product) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {queryError?.message || 'Product not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const product: Product = data.product;
  const isOwner = user?.id === product.owner.id;

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      ELECTRONICS: 'Electronics',
      FURNITURE: 'Furniture',
      HOME_APPLIANCES: 'Home Appliances',
      SPORTING_GOODS: 'Sporting Goods',
      OUTDOOR: 'Outdoor',
      TOYS: 'Toys',
    };
    return labels[category] || category;
  };

  const getRentTypeLabel = (type: string): string => {
    return type === 'PER_HOUR' ? 'per hour' : 'per day';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {getCategoryLabel(category)}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {product.views} views
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(product.datePosted).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Purchase Price</h3>
                  <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Rental Price</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${product.rentPrice.toFixed(2)} {getRentTypeLabel(product.rentType)}
                  </p>
                </div>
              </div>

              {!isOwner && product.isAvailable && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowBuyModal(true)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => setShowRentModal(true)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Rent
                  </button>
                </div>
              )}

              {isOwner && (
                <div className="flex space-x-4">
                  <Link
                    to={`/edit-product/${product.id}`}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Edit Product
                  </Link>
                </div>
              )}

              {!product.isAvailable && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">This product is no longer available.</p>
                </div>
              )}
            </div>

            {/* Owner Info */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Product Owner</h2>
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.owner.firstName} {product.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Product Owner</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {product.owner.email}
                  </div>
                  {product.owner.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {product.owner.address}
                    </div>
                  )}
                  {product.owner.phoneNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {product.owner.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Confirmation Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg max-w-md mx-auto p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Purchase</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <p className="text-gray-500 mb-6">
              Are you sure you want to buy "{product.title}" for ${product.price.toFixed(2)}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setError('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBuyProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rent Modal */}
      {showRentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg max-w-md mx-auto p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rent Product</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={rentStartDate}
                  onChange={(e) => setRentStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={rentEndDate}
                  onChange={(e) => setRentEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-700">
                  Rental rate: ${product.rentPrice.toFixed(2)} {getRentTypeLabel(product.rentType)}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowRentModal(false);
                  setError('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRentProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Rental
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;