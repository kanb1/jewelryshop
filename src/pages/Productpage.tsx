import React from 'react';
// used to extract route parameteres from the current URL
import { useParams } from 'react-router-dom';
import Products from '../components/productpage_components/Products';
import Collections from '../components/productpage_components/Collections';

const Productpage: React.FC = () => {
  // Extract dynamic category from the route

  // example URL: /products/necklaces --> useparams will return {category: "necklaces"}
  const { category } = useParams<{ category: string }>();

  // hvis category findes --> products ellers collections men collections bruges ikke
  return (
    <>
      {category ? (
        <Products /> 
    ) : (
        <Collections /> 
      )}
    </>
  );
};

export default Productpage;
