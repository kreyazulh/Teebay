import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import ProductForm, { ProductFormData } from '../components/products/ProductForm';

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      categories
      price
      rentPrice
      rentType
      ownerId
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      description
      categories
      price
      rentPrice
      rentType
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_PRODUCT, {
    variables: { id: id! },
    skip: !id
  });

  const [updateProduct, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      navigate('/my-products');
    },
    onError: (error) => {
      setError('Failed to update product: ' + error.message);
    }
  });

  const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      navigate('/my-products');
    },
    onError: (error) => {
      setError('Failed to delete product: ' + error.message);
    }
  });

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setError('');
      
      await updateProduct({
        variables: {
          id: id!,
          input: {
            title: formData.title,
            description: formData.description,
            categories: formData.categories,
            price: formData.price,
            rentPrice: formData.rentPrice,
            rentType: formData.rentPeriod === 'DAILY' ? 'PER_DAY' : 'PER_HOUR'
          }
        }
      });
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setError('');
        await deleteProduct({
          variables: { id: id! }
        });
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete product');
      }
    }
  };

  if (queryLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">Error loading product: {queryError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  const product = data.product;
  
  // Convert backend data to form format
  const initialData: ProductFormData = {
    title: product.title,
    description: product.description,
    categories: product.categories,
    price: product.price,
    rentPrice: product.rentPrice,
    rentPeriod: product.rentType === 'PER_DAY' ? 'DAILY' : 'HOURLY'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteLoading ? 'Deleting...' : 'Delete Product'}
        </button>
      </div>
      
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
        initialData={initialData} 
        onSubmit={handleSubmit} 
        isEdit 
        loading={updateLoading}
      />
    </div>
  );
};

export default EditProduct;