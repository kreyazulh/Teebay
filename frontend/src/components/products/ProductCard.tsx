import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

type ProductCardProps = {
  product: Product;
};

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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, categories, description, price, rentPrice, rentType, owner, views, isAvailable } = product;

  const getRentTypeLabel = (type: string): string => {
    return type === 'PER_HOUR' ? '/hour' : '/day';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${id}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>
          {!isAvailable && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              Sold
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {getCategoryLabel(category)}
            </span>
          ))}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>By {owner.firstName} {owner.lastName}</span>
          <span>{views} views</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              Rent: ${rentPrice.toFixed(2)}{getRentTypeLabel(rentType)}
            </p>
          </div>
          
          <Link
            to={`/product/${id}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAvailable 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'View Details' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;