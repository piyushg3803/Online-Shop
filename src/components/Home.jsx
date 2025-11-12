import { faCartShopping, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { use, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import '/src/index.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function Home() {

    const [product, setProduct] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://online-shop-backend-qpnv.onrender.com/api/product');
                const data = await response.json();
                setProduct(data.products);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                setError(error);
                setLoading(false);
            }
        }

        loadProducts()
    }, [])

    console.log("Products", product);

    const generateStars = (rating) => {
        const stars = [];

        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(
                <FontAwesomeIcon icon={faStar} className='text-yellow-400 text-sm' key={i} size='lg' />
            )
        }
        return stars;
    }

    const handleCart = async (productId) => {
        try {
            const token = localStorage.getItem("authToken")
            if (!token) {
                alert("You need to log in to add products to cart!");
                return;
            }
            else {
                const selectedProduct = product.find((item) => item._id === productId);
                const response = await axios.post(`https://online-shop-backend-qpnv.onrender.com/api/cart/${ productId }`, {
                    productId: selectedProduct._id,
                    quantity: 1,
                }, {
                    headers: {
                        Authorization: `Bearer ${ token }`
                    }
                });
                console.log('Product added to cart:', response.data);
                alert("Product Added to Cart")
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleFavs = async (productId) => {
        try {
            const token = localStorage.getItem("authToken")

            if (!token) {
                alert("You need to log in to add product to watchlist!");
                return;
            }

            const selectedProduct = product.find((item) => item._id === productId);
            const response = await axios.post(`https://online-shop-backend-qpnv.onrender.com/api/auth/user/watchlist/${ productId }`, {
                productId: selectedProduct._id,
            },
                {
                    headers: {
                        Authorization: `Bearere ${ token }`
                    }
                });
            console.log('Product added to wishlist:', response.data);
            alert("Product Added to Wishlist")
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("Product already in wishlist")
            }
            else {
                alert("Error adding product to wishlist")
                console.error('Error adding product to wishlist:', error);
            }
        }
    };

    return (
        <div className='pt-16 pb-10 bg-gray-50 font-jakarta'>
            {/* loading state */}
            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-700">Loading Products...</p>
                    </div>
                </div>
            )}

            {/* error state */}
            {!loading && error && (
                <div className="text-center text-red-600">
                    <p>Failed to load products. Please try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading &&
                (product.length > 0 ?
                    (<div className="grid grid-cols-2 lg:gap-4 lg:grid-cols-3 xl:mx-52" id="#offers">
                        {
                            product.map((product) => (
                                <div
                                    key={product._id}
                                    className="product-card text-center relative lg:py-6 m-2 p-3 text-lg bg-white rounded-xl shadow-sm transition-all duration-300"
                                >
                                    <div className='btn-container opacity-0 pointer-events-none flex-col absolute top-2 right-3'>
                                        <FontAwesomeIcon
                                            onClick={() => handleCart(product._id)}
                                            className="text-teal-600 bg-teal-100 w-[45%] m-2 p-2 rounded-full text-xs hover:scale-105 transform-transition duration-300"
                                            icon={faCartShopping} size='lg'
                                        />
                                        <FontAwesomeIcon
                                            onClick={() => handleFavs(product._id)}
                                            className="text-teal-600 bg-teal-100 w-[45%] m-2 p-2 rounded-full text-xs hover:scale-105 transform-transition duration-300"
                                            icon={faHeart} size='lg'
                                        />
                                    </div>

                                    <img
                                        src={product.productImages[0].url}
                                        alt={product.name}
                                        className="h-48 object-contain transition-transform hover:scale-105 duration-300 mx-auto p-8 md:p-4 w-64 rounded-lg mb-4"
                                    />
                                    <Link to={`/product/${ product._id }`}
                                        state={{
                                            name: product.name,
                                            image: product.productImages[0]?.url,
                                            price: product.price,
                                            description: product.description,
                                            stars: product.ratings,
                                            reviews: product.numReviews
                                        }} >
                                        <h3 className="font-semibold text-gray-800 text-lg md:text-2xl line-clamp-1 my-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-800 font-semibold text-lg lg:text-xl">Price: <span className='text-teal-600 font-bold'>₹{product.price}</span></p>
                                    <div className='flex justify-center items-center my-3'>
                                        <div className='flex justify-center my-2'>{generateStars(product.ratings)}</div>
                                        <p className='ms-2 text-gray-700'>({product.numReviews}<span className='hidden lg:blocj'>Reviews</span>)</p>
                                    </div>

                                    <div className="flex justify-between mt-2 lg:hidden">
                                        <FontAwesomeIcon
                                            onClick={() => handleCart(product._id)}
                                            className="text-white bg-teal-600 w-[45%] mx-2 p-2 rounded-xl text-xs hover:scale-105 transform-transition duration-300"
                                            icon={faCartShopping} size='sm'
                                        />
                                        <FontAwesomeIcon
                                            onClick={() => handleFavs(product._id)}
                                            className="text-white bg-teal-600 w-[45%] mx-2 p-2 rounded-xl text-xs hover:scale-105 transform-transition duration-300"
                                            icon={faHeart} size='sm'
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    ) : (
                        <div className="text-center text-gray-700 py-36">
                            <p>No products available at the moment.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg"
                            >
                                Retry
                            </button>
                        </div>
                    )
                )
            }
        </div>
    )
}

export default Home