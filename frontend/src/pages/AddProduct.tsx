import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import ProductForm from '../components/products/ProductForm';
import { ProductFormData } from '../types';
import { useAuth } from '../lib/context/AuthContext';
import { CREATE_PRODUCT } from '../lib/graphql/mutations';
import { GET_MY_PRODUCTS, GET_ALL_PRODUCTS } from '../lib/graphql/queries';

const AddProduct: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GraphQL mutation to create product
  const [createProductMutation] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [
      { query: GET_MY_PRODUCTS },
      { query: GET_ALL_PRODUCTS }
    ],
    onCompleted: (data) => {
      console.log('Product created successfully:', data);
      navigate('/my-products');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product');
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Map form data to GraphQL input format
      const productInput = {
        title: formData.title,
        description: formData.description,
        categories: formData.categories,
        price: formData.price,
        rentPrice: formData.rentPrice,
        rentType: formData.rentPeriod === 'DAILY' ? 'PER_DAY' : 'PER_HOUR'
      };

      await createProductMutation({
        variables: {
          input: productInput
        }
      });

    } catch (error: any) {
      console.error('Error submitting product:', error);
      setError(error.message || 'Failed to create product');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add a New Product</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <ProductForm 
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddProduct;