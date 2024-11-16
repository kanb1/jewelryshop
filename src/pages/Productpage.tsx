import React from 'react';
import { useParams } from 'react-router-dom';
import Products from '../components/productpage_components/Products';
import Collections from '../components/productpage_components/Collections';

const Productpage: React.FC = () => {
  // Extract dynamic category from the route
  const { category } = useParams<{ category: string }>();

  return (
    <>
      {category ? (
        <Products /> // Render Products if a category is specified in the URL
    ) : (
        <Collections /> // Render Collections if no category is specified
      )}
    </>
  );
};

export default Productpage;
