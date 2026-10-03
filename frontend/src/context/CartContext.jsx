import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x.id === product.id);

            if (existItem) {
                // If item exists, update its quantity
                return prevItems.map((x) =>
                    x.id === existItem.id ? { ...x, qty: x.qty + qty } : x
                );
            } else {
                // Add new item
                return [...prevItems, { ...product, qty }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((x) => x.id !== id));
    };

    const updateQuantity = (id, qty) => {
        setCartItems((prevItems) => 
            prevItems.map((x) => (x.id === id ? { ...x, qty } : x))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate totals
    const cartTotalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const cartTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            cartTotalItems,
            cartTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
