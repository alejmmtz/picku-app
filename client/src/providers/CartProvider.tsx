/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import type { Product } from "../types/product.types";
import type { CartItem } from "../types/cart.types";

//defines everything the cart context will expose
interface CartContextType {
  cartItems: CartItem[];

  addToCart: (product: Product) => void;

  increaseQuantity: (productId: number) => void;

  decreaseQuantity: (productId: number) => void;

  removeFromCart: (productId: number) => void;

  clearCart: () => void;

  subtotal: number;
}

//create cart context!
const CartContext = createContext<CartContextType | null>(null);

const normalizeCartItem = (item: CartItem): CartItem => ({
  ...item,
  quantity: Number(item.quantity),
  product: {
    ...item.product,
    id: Number(item.product.id),
    price: Number(item.product.price),
  },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {

  //initialize cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("picku_cart");

    //if no cart exists return empty array
    if (!storedCart) return [];

    try {
      return (JSON.parse(storedCart) as CartItem[]).map(normalizeCartItem);

    } catch {

      return [];
    }
  });

  //save cart every time cartItems changes
  useEffect(() => {
    localStorage.setItem("picku_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  //add product to cart
  const addToCart = (product: Product) => {
    const normalizedProduct = {
      ...product,
      id: Number(product.id),
      price: Number(product.price),
    };

    setCartItems((prevItems) => {

      //check if product already exists
      const existingItem = prevItems.find(
        (item) => item.product.id === normalizedProduct.id
      );

      //if product exists increase quantity
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === normalizedProduct.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      //otherwise create new cart item
      return [
        ...prevItems,
        {
          product: normalizedProduct,
          quantity: 1,
        },
      ];
    });
  };

  //increase number
  const increaseQuantity = (productId: number) => {

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {

    setCartItems((prevItems) =>
      prevItems

        //reduce quantity
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )

        //remove item if quantity becomes 0
        .filter((item) => item.quantity > 0)
    );
  };

  //remove item
  const removeFromCart = (productId: number) => {

    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.product.id !== productId
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  //calculate subtotal 
  const subtotal = useMemo(() => {

    return cartItems.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    );

  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
};
