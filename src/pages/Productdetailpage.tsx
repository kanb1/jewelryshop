import React from 'react';
import ProductDetail from '../components/productdetailpage_components/ProductDetail';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { updateCartCount } = useCart();

  return <ProductDetail updateCartCount={updateCartCount} />;
};

export default ProductDetailPage;
