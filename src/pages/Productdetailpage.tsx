import React from 'react';
import ProductDetail from '../components/productdetailpage_components/ProductDetail';
import { useCart } from '../context/CartContext';
import { useParams } from 'react-router-dom'; 
import Comments from '../components/productdetailpage_components/Comments';



const ProductDetailPage: React.FC = () => {
  const { updateCartCount } = useCart();
  const { id } = useParams<{ id: string }>(); // Hent produkt-ID fra URL'en

  // Ensure id is a string
  if (!id) {
    return <div>Error: Product ID not found.</div>;
  }

  return (
    <>
      <ProductDetail updateCartCount={updateCartCount} />
      <Comments productId={id} /> {/* Send produkt-ID som prop */}
    </>
  );
};

export default ProductDetailPage;
