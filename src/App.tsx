import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import JewelryProducts from './components/JewelryProducts';
import Navbar from './components/Navbar';
import FrontpageLinkSection from './components/FrontpageLinkSection';


const App: React.FC = () => {
  return (
    <ChakraProvider>
    <Navbar />
    <div className="App">
      <header className="App-header">
        <FrontpageLinkSection/>
      </header>
    </div>
    </ChakraProvider>
  );
};

export default App;
