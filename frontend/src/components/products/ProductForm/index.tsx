import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Category, ProductFormData } from '../../../types';
import Step1Title from './Step1Title';
import Step2Categories from './Step2Categories';
import Step3Description from './Step3Description';
import Step4Price from './Step4Price';
import Step5RentDetails from './Step5RentDetails';
import Step6Summary from './Step6Summary';
import FormProgress from './FormProgress';

type ProductFormProps = {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isEdit?: boolean;
};

const defaultFormData: ProductFormData = {
  title: '',
  categories: [],
  description: '',
  price: 0,
  rentPrice: 0,
  rentPeriod: 'DAILY',
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData = defaultFormData, onSubmit, isEdit = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateFormData = (update: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...update }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      navigate('/my-products');
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, component: <Step1Title title={formData.title} onChange={(title) => updateFormData({ title })} /> },
    { id: 2, component: <Step2Categories categories={formData.categories} onChange={(categories) => updateFormData({ categories })} /> },
    { id: 3, component: <Step3Description description={formData.description} onChange={(description) => updateFormData({ description })} /> },
    { id: 4, component: <Step4Price price={formData.price} onChange={(price) => updateFormData({ price })} /> },
    { id: 5, component: <Step5RentDetails rentPrice={formData.rentPrice} rentPeriod={formData.rentPeriod} onChange={(update) => updateFormData(update)} /> },
    { id: 6, component: <Step6Summary formData={formData} /> },
  ];

  const currentStepComponent = steps.find((step) => step.id === currentStep)?.component;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <FormProgress currentStep={currentStep} totalSteps={steps.length} />
      
      <div className="mt-8 mb-8">
        {currentStepComponent}
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Back
        </button>
        
        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductForm;