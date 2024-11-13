import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Frontpage from './pages/Frontpage';
import theme from './theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          {/* Flere sider kan tilføjes her */}
        </Routes>
        <Footer/>
      </Router>
    </ChakraProvider>
  );
};

export default App;
