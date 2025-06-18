import React from 'react';
import { ProductFormData } from './index';

type Step5RentDetailsProps = {
  rentPrice: number;
  rentPeriod: ProductFormData['rentPeriod'];
  onChange: (update: Partial<ProductFormData>) => void;
};

const Step5RentDetails: React.FC<Step5RentDetailsProps> = ({ rentPrice, rentPeriod, onChange }) => {
  const handleRentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ rentPrice: value });
  };

  const handleRentPeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ rentPeriod: e.target.value as ProductFormData['rentPeriod'] });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Set rental details</h2>
      <p className="mb-4 text-gray-600">
        In addition to selling, you can also offer your product for rent. Set the rental price and period below.
      </p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="rentPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Rental Price (USD)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="rentPrice"
              name="rentPrice"
              min="0"
              step="0.01"
              value={rentPrice || ''}
              onChange={handleRentPriceChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="rentPeriod" className="block text-sm font-medium text-gray-700 mb-1">
            Rental Period
          </label>
          <select
            id="rentPeriod"
            name="rentPeriod"
            value={rentPeriod}
            onChange={handleRentPeriodChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Select the time period for your rental rate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step5RentDetails;