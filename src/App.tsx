import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from './components/Navbar';
import FrontpageLinkSection from './components/FrontpageLinkSection';
import FrontpageHeroVideo from './components/FrontpageHeroVideo';
import theme from './theme';


const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
    <Navbar />
    <div className="App">
      <header className="App-header">
        <FrontpageHeroVideo />
        <FrontpageLinkSection/>
      </header>
    </div>
    </ChakraProvider>
  );
};

export default App;
