import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../Context/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes, faStar, faTrash, faShoppingCart, faExclamation, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Wishlist() {

    const { favItems = [], setFavItems = () => { }, cartItems = [], setcartItems = () => { }, itemNum, setitemNum } = useContext(CartContext);

    const [wishList, setWishlist] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken'); // Retrieve token for authentication

                if (!token) {
                    setError('You need to log in to view your Wishlist items!'); // Set error message if token is not present
                    setLoading(false);
                    return;
                }
                const response = await fetch('https://online-shop-backend-qpnv.onrender.com/api/auth/user/watchlist', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                });
                const data = await response.json();
                setWishlist(data.data.products || []); // Set wishlist items from API response

                setLoading(false);
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
                setError('Failed to load Wishlist items. Please try again later.');
                setLoading(false);
            }
        };

        loadWishlist();
    }, [])

    const generateStars = (index, rating) => {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(
                <FontAwesomeIcon key={index} icon={faStar} className='text-yellow-400' />
            )
        }
        return stars;
    }

    useEffect(() => {
        const totalItems = favItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setitemNum(totalItems);
    }, [favItems, setitemNum]);

    const handleCart = async (productId) => {
        try {
            const token = localStorage.getItem("authToken")

            const selectedProduct = wishList.find((item) => item._id === productId);
            const response = await axios.post(`https://online-shop-backend-qpnv.onrender.com/api/cart/${productId}`, {
                productId: selectedProduct._id,
                quantity: 1,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Product added to cart:', response.data);
            alert("Product Moved to Cart")

        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/auth/user/watchlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedItems = cartItems.filter((item) => item.product._id !== productId);
                setWishlist(updatedItems);
                alert("Removed item from the wishlist")
            } else {
                console.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }

        window.location.reload()
    };

    return (
        <div className="min-h-auto bg-gray-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8 font-jakarta">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                    Your Wishlist
                </h1>
                {loading ? (
                    // Loading State
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center py-8 px-6 bg-white rounded-xl shadow-md">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-700">Loading your wishlist...</p>
                        </div>
                    </div>
                ) : error ? (
                    // Error State
                    <div className="text-center bg-white rounded-xl shadow-md py-10 px-6 max-w-2xl mx-auto">
                        <div className="text-red-500 text-5xl mb-4">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                        </div>
                        <h1 className="text-xl md:text-2xl text-red-500 font-semibold">{error}</h1>
                        <Link to="/" className="mt-6 inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
                            Go Back to Products
                        </Link>
                    </div>
                ) : wishList.length === 0 ? (
                    // Empty Wishlist
                    <div className="text-center bg-white rounded-xl shadow-md py-12 px-6 max-w-2xl mx-auto">
                        <div className="text-teal-600 text-6xl mb-6">
                            <FontAwesomeIcon icon={faHeart} />
                        </div>
                        <h1 className="text-xl md:text-2xl text-gray-800 mb-4 font-medium">
                            Your Wishlist is currently empty
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven't added anything to your cart yet. Start shopping to fill it with amazing products!
                        </p>
                        <Link
                            to="/"
                            className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-8 rounded-lg font-medium text-base md:text-lg transition duration-300"
                        >
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    // Wishlist Items List
                    <div className='lg:flex lg:gap-8'>
                        <div className='lg:flex-grow'>
                            <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                                {wishList.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div>
                                            <img
                                                src={item.productImages[0]?.url}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="ml-4 flex-grow">
                                            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <div className="mt-1 text-lg font-semibold text-teal-600">
                                                ₹{item.price}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    {generateStars(item._id, item.ratings || 0)}
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                    <button
                                                        onClick={() => handleCart(item._id)}
                                                        className="bg-teal-600 text-white py-2 px-4 text-sm md:text-base rounded-lg"
                                                    >
                                                        <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Wishlist