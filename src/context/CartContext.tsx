import React, { createContext, useState, useContext, ReactNode } from 'react';

// Vi bruger cartcontext for at undgå at pass cart state as props til hver child component, fordi det bliver messy og hard to maintain
// CartContext gemmer cart state (cartCount) og funktioner som updatecartCount i 1 centralt sted
// Vi har nemlig både navbar, cartpage og productpage som har brug for at vide og opdatere cart's state

// Define the shape of the cart context, what the cartcontext will store and provide
interface CartContextType {
  // a number representing the ttoal count of items in the cart
  cartCount: number;
  // a function to update cartCount directly
  setCartCount: React.Dispatch<React.SetStateAction<number>>; 
  // increment cartcount by 1
  updateCartCount: () => void;
}




// Create the CartContext
// A context is like a glocal state that u can access from any child component within the provider
// default is undefined, because it will only work if it's used insdie a cartprovider
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for the CartProvider
// it accept a children prop, which represents any react components wrapped by the provider
interface CartProviderProps {
  children: ReactNode;
}

// Provide cart-related state and functions
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  //total amount of items in cart
  const [cartCount, setCartCount] = useState<number>(0);




  // Function to update the cart count (increments the count by 1)
  const updateCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };




  // wraps the children components, eg my app.tsx amd provides those values
  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};





// Custom hook for accessing the cartcontext 
// It means instead of importing useContext(CartContext) in every component, you can just use useCart()
// In any component I can do: 
  // const { cartCount, setCartCount, updateCartCount } = useCart();


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
