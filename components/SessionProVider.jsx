"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useState } from "react";

export const CartContext = createContext([]);

function SessionProVider({ children, session }) {
  const [cartItems, setCartIItems] = useState([]);

  const setCartItems = (data) => {
    setCartIItems(data);
  };

  return (
    <CartContext.Provider value={[cartItems, setCartItems]}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </CartContext.Provider>
  );
}
export default SessionProVider;
