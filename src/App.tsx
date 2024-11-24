import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Frontpage from './pages/Frontpage';
import Productpage from './pages/Productpage';
import ProductDetail from './components/productdetailpage_components/ProductDetail';
import LoginPage from './pages/Authorization/Login';
import SignupPage from './pages/Authorization/Signup';
import Profile from "./pages/Profile";
import Cartpage from './pages/Cartpage';
import ProductDetailPage from './pages/Productdetailpage';
import Checkoutpage from './pages/Checkoutpage';
import theme from './theme';

import { CartProvider, useCart } from './context/CartContext';


const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("jwt"));


  return (
    <CartProvider>
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          {/* the route /products/:category dynamically captures the category segment from the URL. */}
          <Route path="/products/:category" element={<Productpage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cartpage/>} />
          <Route path="/checkout" element={<Checkoutpage />} />
        </Routes>
        <Footer />
      </Router>
    </ChakraProvider>
    </CartProvider>

  );
};

export default App;
