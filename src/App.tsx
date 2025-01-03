import React from 'react';
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
import RecyclePage from './pages/Recyclepage';
import About from './pages/Aboutpage';
import theme from './theme';

import { CartProvider} from './context/CartContext';
import { AuthProvider } from "./context/AuthContext";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ResetPassword from './components/authorization_components/ResetPassword';
import ForgotPassword from './components/authorization_components/ForgotPassword';
import ManageRecycleProducts from './components/recyclepage_components/ManageRecycleProducts';
import CSRFTestForm from './components/CSRFTestForm';
import VerifyEmail from './pages/Authorization/VerifyEmail';

// Initialize Stripe with my public key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe("pk_test_51QOfWI2NXuSUDNPpoB5ApMoesVZEDQIkFh3vZICP1JMwbv1IV5S1OX8m7LKBZ5TurvNb94eRfkHEVBxvGghE6cMa00P9IM9drn");



const App: React.FC = () => {



  return (
    <AuthProvider>
    <CartProvider>
    <ChakraProvider theme={theme}>
    <Elements stripe={stripePromise}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          {/* the route /products/:category dynamically captures the category segment from the URL. */}
          <Route path="/products/:category" element={<Productpage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage/>} />
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
          <Route path="/recycle" element={<RecyclePage />} />
          <Route path="/user-manage-recycleproducts" element={<ManageRecycleProducts />} />
          {/* CSRF testform */}
          <Route path="/csrf-test" element={<CSRFTestForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

        </Routes>
        <Footer />
      </Router>
      </Elements>

    </ChakraProvider>
    </CartProvider>
    </AuthProvider>

  );
};

export default App;
