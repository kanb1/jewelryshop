import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the cart context
interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  updateCartCount: () => void;
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Provide cart-related state and functions
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Function to update the cart count (increments the count by 1)
  const updateCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
