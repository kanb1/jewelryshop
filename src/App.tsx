import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Frontpage from './pages/Frontpage';
import Productpage from './pages/Productpage';
import ProductDetail from './pages/ProductDetail';
import theme from './theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          {/* the route /products/:category dynamically captures the category segment from the URL. */}
          <Route path="/products/:category" element={<Productpage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </Router>
    </ChakraProvider>
  );
};

export default App;
