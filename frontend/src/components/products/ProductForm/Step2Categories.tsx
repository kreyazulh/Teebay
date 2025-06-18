import React from 'react';
import { Category } from '../../../types';

type Step2CategoriesProps = {
  categories: Category[];
  onChange: (categories: Category[]) => void;
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'HOME_APPLIANCES', label: 'Home Appliances' },
  { value: 'SPORTING_GOODS', label: 'Sporting Goods' },
  { value: 'OUTDOOR', label: 'Outdoor' },
  { value: 'TOYS', label: 'Toys' },
];

const Step2Categories: React.FC<Step2CategoriesProps> = ({ categories, onChange }) => {
  const handleCategoryChange = (category: Category) => {
    if (categories.includes(category)) {
      onChange(categories.filter((c) => c !== category));
    } else {
      onChange([...categories, category]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select categories</h2>
      <p className="mb-4 text-gray-600">Choose one or more categories that best describe your product.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIES.map((category) => (
          <div key={category.value} className="flex items-center">
            <input
              type="checkbox"
              id={category.value}
              checked={categories.includes(category.value)}
              onChange={() => handleCategoryChange(category.value)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={category.value} className="ml-2 block text-sm text-gray-700">
              {category.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2Categories;