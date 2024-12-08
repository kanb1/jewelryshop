import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Frontpage from './pages/Frontpage';
import Productpage from './pages/Productpage';
import LoginPage from './pages/Authorization/Login';
import SignupPage from './pages/Authorization/Signup';
import Profile from "./pages/Profilepage";
import Cartpage from './pages/Cartpage';
import ProductDetailPage from './pages/Productdetailpage';
import Checkoutpage from './pages/Checkoutpage';
import Adminpage from './pages/Adminpage';
import About from './pages/Aboutpage';
import theme from './theme';

import { CartProvider} from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ResetPassword from './components/authorization_components/ResetPassword';
import ForgotPassword from './components/authorization_components/ForgotPassword';

// Initialize Stripe with your public key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe("pk_test_51QOfWI2NXuSUDNPpoB5ApMoesVZEDQIkFh3vZICP1JMwbv1IV5S1OX8m7LKBZ5TurvNb94eRfkHEVBxvGghE6cMa00P9IM9drn");



// console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);



const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("jwt"));


  return (
    <CartProvider>
    <ChakraProvider theme={theme}>
    <Elements stripe={stripePromise}>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          {/* the route /products/:category dynamically captures the category segment from the URL. */}
          <Route path="/products/:category" element={<Productpage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cartpage/>} />
            {/* Wrap CheckoutPage with the Elements provider */}
          <Route path="/checkout" element={<Checkoutpage />}/>   
           {/*I set up as a nested route, with subpaths handled by the AdminPage component.  */}
          <Route path="/admin/*" element={<Adminpage />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </Router>
      </Elements>

    </ChakraProvider>
    </CartProvider>

  );
};

export default App;
