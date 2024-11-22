import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Frontpage from './pages/Frontpage';
import Productpage from './pages/Productpage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/Authorization/Login';
import SignupPage from './pages/Authorization/Signup';
import Profile from "./pages/Profile";
import theme from './theme';



const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("jwt"));


  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          {/* the route /products/:category dynamically captures the category segment from the URL. */}
          <Route path="/products/:category" element={<Productpage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
        <Footer />
      </Router>
    </ChakraProvider>
  );
};

export default App;
