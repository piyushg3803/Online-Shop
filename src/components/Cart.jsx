import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShippingFast, faCheck, faTimes, faPlus, faMinus, faShoppingCart, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);
    const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

    // Fetch cart items from the API
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const token = localStorage.getItem('authToken');

                if(!token) {
                    setError('You need to log in to view your Cart.');
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://ecom-kl8f.onrender.com/api/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setCartItems(data.cart.items || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to load cart items. Please try again later.');
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    // Update quantity of a cart item
    const updateQuantity = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/cart/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity: Math.max(1, quantity)
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Quantity Updated Successfully', data);

                const updatedCart = cartItems.map((item) =>
                    item.product._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                );
                setCartItems(updatedCart);
            } else {
                const errorData = await response.json();
                console.error('Failed to update quantity', errorData);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Remove an item from the cart
    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://ecom-kl8f.onrender.com/api/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedItems = cartItems.filter((item) => item.product._id !== productId);
                setCartItems(updatedItems);
            } else {
                console.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    // Toast notification function
    const [toast, setToast] = useState({ show: false, message: '' });
    
    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            showToast('You need to log in to place an order.');
            return;
        }

        if (!street || !city || !state || !pincode || !phone) {
            showToast('Please fill in all the fields.');
            return;
        }

        const orderData = {
            items: cartItems.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            shippingAddress: {
                street,
                city,
                state,
                pinCode: pincode,
                phone,
            },
            paymentInfo: {
                id: "mock-payment-id",
                status: "success",
                type: "card",
            },
        };

        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/order/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                const order = data.order;
                console.log('Order Response:', order);

                setOrderDetails(order);
                setShowOrderConfirmation(true);

                const productLink = cartItems[0]?.product?.download_url; 
                if (productLink) {
                    setTimeout(() => {
                        window.location.href = productLink;
                    }, 2000); 
                }

                // Clear the cart after successful order
                setCartItems([]);
                setShowCheckoutForm(false);
            } else {
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
                showToast('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error.message);
            showToast('Failed to place order. Please try again.');
        }
    };

    const totalProducts = cartItems.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <div className="min-h-auto bg-gray-50 pt-20 pb-32 px-4 sm:px-6 lg:px-8 font-jakarta">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                    Your Shopping Cart
                </h1>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center py-8 px-6 bg-white rounded-xl shadow-md">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                            <p className="text-lg text-gray-700">Loading your cart...</p>
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
                ) : cartItems.length === 0 ? (
                    // Empty Cart
                    <div className="text-center bg-white rounded-xl shadow-md py-12 px-6 max-w-2xl mx-auto">
                        <div className="text-teal-600 text-6xl mb-6">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </div>
                        <h1 className="text-xl md:text-2xl text-gray-800 mb-4 font-medium">
                            Your cart is currently empty
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
                    // Cart Items List with Order Summary
                    <div className="lg:flex lg:gap-8">
                        {/* Cart Items Section */}
                        <div className="lg:flex-grow">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-800">Shopping Cart ({totalProducts} items)</h2>
                                </div>
                                
                                <div className="max-h-[32rem] overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.product.productImages[0]?.url}
                                                    alt={item.product.name}
                                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="ml-4 flex-grow">
                                                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                                    {item.product.name}
                                                </h3>
                                                <div className="mt-1 text-lg font-semibold text-teal-600">
                                                    ₹{item.product.price}
                                                </div>
                                                
                                                <div className="mt-3 flex items-center justify-between">
                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button 
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FontAwesomeIcon icon={faMinus} size="xs" />
                                                        </button>
                                                        <span className="px-4 py-1 text-gray-800 font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                        >
                                                            <FontAwesomeIcon icon={faPlus} size="xs" />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => removeItem(item.product._id)}
                                                        className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:w-96 mt-6 lg:mt-0">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">₹{totalPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">Free</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span className="text-teal-600">₹{totalPrice}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setShowCheckoutForm(true)}
                                        className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition duration-300"
                                    >
                                        <FontAwesomeIcon icon={faShippingFast} />
                                        Proceed to Checkout
                                    </button>
                                    
                                    <div className="mt-6 text-center">
                                        <Link to="/" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Form Modal */}
            {showCheckoutForm && (
                <div className="fixed inset-0 bg-teal-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCheckout} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        placeholder="Enter your street address"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="State"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            placeholder="Pincode"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Phone number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckoutForm(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Confirmation Modal */}
            {showOrderConfirmation && (
                <div className="fixed inset-0 bg-teal-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                                <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Order Placed Successfully!</h2>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="font-medium text-gray-800 mb-1">Order Details</p>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-600">Order ID:</span> <span className="font-medium">{orderDetails._id}</span></p>
                                    <p><span className="text-gray-600">Total Amount:</span> <span className="font-medium">₹{orderDetails.totalAmount}</span></p>
                                    <p><span className="text-gray-600">Status:</span> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{orderDetails.status}</span></p>
                                    <p><span className="text-gray-600">Date:</span> <span className="font-medium">{new Date(orderDetails.paidAt).toLocaleString()}</span></p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-6">
                                Thank you for your purchase! A confirmation email will be sent to your registered email address.
                            </p>
                            <button
                                onClick={() => setShowOrderConfirmation(false)}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn">
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default Cart;