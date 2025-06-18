import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import ProductCard from '../components/products/ProductCard';
import { Product, Category } from '../types';
import { GET_ALL_PRODUCTS } from '../lib/graphql/queries';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'HOME_APPLIANCES', label: 'Home Appliances' },
  { value: 'SPORTING_GOODS', label: 'Sporting Goods' },
  { value: 'OUTDOOR', label: 'Outdoor' },
  { value: 'TOYS', label: 'Toys' },
];

const Home: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // GraphQL query to get all products
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRODUCTS, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const handleCategoryToggle = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filter products based on search term and selected categories
  const filteredProducts = (data?.products || []).filter((product: Product) => {
    // Filter by search term
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by categories (if any are selected)
    const matchesCategories = selectedCategories.length === 0 || 
                              product.categories.some(cat => selectedCategories.includes(cat as Category));
    
    return matchesSearch && matchesCategories && product.isAvailable;
  });

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load products. Please try again.
            </p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-blue-600 text-white py-12 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Welcome to Teebay</h1>
          <p className="text-xl">Buy, sell, and rent products from our community.</p>
        </div>
      </section>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Filter by Category:</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryToggle(category.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>
        {data?.products && (
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {data.products.length} products
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {data?.products?.length === 0 
              ? 'No products available yet.' 
              : 'No products match your current filters.'}
          </p>
          {selectedCategories.length > 0 || searchTerm && (
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSearchTerm('');
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;