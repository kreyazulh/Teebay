import React from 'react';
import { ProductFormData } from './index';

type Step6SummaryProps = {
  formData: ProductFormData;
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

const getRentPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
  };
  return labels[period] || period;
};

const Step6Summary: React.FC<Step6SummaryProps> = ({ formData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Summary</h2>
      <p className="mb-6 text-gray-600">
        Please review your product details before submitting.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Title</h3>
            <p className="mt-1 text-md text-gray-900">{formData.title}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {formData.categories.length > 0 ? (
                formData.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {getCategoryLabel(category)}
                  </span>
                ))
              ) : (
                <p className="text-gray-700">No categories selected</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-md text-gray-900 whitespace-pre-line">
              {formData.description || 'No description provided'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sale Price</h3>
              <p className="mt-1 text-md text-gray-900">${formData.price.toFixed(2)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rent Price</h3>
              <p className="mt-1 text-md text-gray-900">
                ${formData.rentPrice.toFixed(2)} ({getRentPeriodLabel(formData.rentPeriod)})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6Summary;