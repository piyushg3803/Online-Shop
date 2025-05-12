import React, { Children, useContext, useState } from 'react'
import CartContext from './context'
import { AuthContext } from './AuthContext';

function ContextProvider({ children }) {

    const [cartItems, setcartItems] = useState([]);
    const [favItems, setfavItems] = useState([]);
    const [itemNum, setitemNum] = useState(0);

    const { isAuthenticated } = useContext(AuthContext)

    const addToCart = (product) => {
        if(!isAuthenticated) {
            alert("You have to log in to add products in the cart!");
            return;
        }

        setcartItems((prevData) => {
            const existingItem = prevData.find((item) => item.id === product.id);
            if (existingItem) {
                return prevData.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevData, { ...product, quantity: 1 }];
        });
    };

    const addToFavs = (product) => {
        if(!isAuthenticated) {
            alert("You have to log in to add products in wishlist!");
            return;
        }

        setfavItems((prevData) => {
            const existingItem = prevData.find((item) => item.id === product.id);
            if (existingItem) {
                return prevData;
            }
            const updatedFavs = [...prevData, { ...product }];
            console.log("Updated Fav Items in Context:", updatedFavs); // Debugging
            return updatedFavs;
        });
    };


    return (
        <CartContext.Provider value={{ cartItems, setcartItems, addToCart, favItems, setfavItems, addToFavs, itemNum, setitemNum }}>
            {children}
        </CartContext.Provider>
    )
}

export default ContextProvider