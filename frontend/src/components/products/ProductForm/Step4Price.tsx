import React from 'react';

type Step4PriceProps = {
  price: number;
  onChange: (price: number) => void;
};

const Step4Price: React.FC<Step4PriceProps> = ({ price, onChange }) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange(value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Set your selling price</h2>
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Product Price (USD)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={price || ''}
            onChange={handlePriceChange}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">USD</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Set a competitive price for your product. You can compare similar items on the marketplace.
        </p>
      </div>
    </div>
  );
};

export default Step4Price;