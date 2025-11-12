import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function SingleUser() {
    const { id } = useParams(); // Get the user ID from the URL
    const [userDetails, setUserDetails] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state

    const handlePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('authToken');

                const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/auth/admin/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                console.log("response", data);

                setUserDetails(data.user);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user details. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/auth/admin/user/${id}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data.cart.items || []);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch cart items. Please try again.');
        }
    };

    fetchCartItems();

    const fetchWishlistItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/auth/admin/user/${id}/watchlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist items');
            }

            const data = await response.json();
            setWishlistItems(data.data.products || []);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch wishlist items. Please try again.');
        }
    };

    fetchWishlistItems();

    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    if (loading) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading User Details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    return (
        <div className="pt-8 font-jakarta">
            {/* Sidebar Toggle Button */}
            <div
                className="block md:hidden bg-teal-600 text-white text-center rounded-full m-4 w-28 p-2 right-2"
                onClick={handlePanel}
            >
                <p>{isOpen ? 'Close Panel' : 'Open Panel'}</p>
            </div>

            <div className="flex h-full bg-teal-600">
                {/* Sidebar */}
                <div
                    className={`absolute h-screen md:relative md:translate-x-0 w-64 bg-teal-600 text-white flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        } transition-all duration-100`}
                >
                    <div className="p-6 text-2xl font-bold border-b border-teal-700">Admin Panel</div>
                    <nav className="flex-1 p-4">
                        <ul className="space-y-4">
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin" className="block">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/userList" className="block">
                                    Registered Users
                                </Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/orderList" className="block">
                                    Recent Orders
                                </Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/productList" className="block">
                                    Product List
                                </Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/addProduct" className="block">
                                    Add Product
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    <div className="bg-white border border-teal-200 rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-6">User Details</h1>
                        <div className="space-y-4">
                            <p className="text-lg">
                                <strong>Name:</strong> {userDetails?.name || 'N/A'}
                            </p>
                            <p className="text-lg">
                                <strong>Email:</strong> {userDetails?.email || 'N/A'}
                            </p>
                            <p className="text-lg">
                                <strong>Phone:</strong> {userDetails?.phone || 'N/A'}
                            </p>
                            <p className="text-lg">
                                <strong>Role:</strong> {userDetails?.role || 'N/A'}
                            </p>
                            <p className="text-lg">
                                <strong>User Registered:</strong> {new Date(userDetails?.createdAt).toLocaleDateString('en-IN', options) || 'N/A'}
                            </p>
                            <p className="text-lg">
                                <strong>User Updated:</strong> {new Date(userDetails?.updatedAt).toLocaleDateString('en-IN', options) || 'N/A'}
                            </p>
                            <p className="text-lg">
                                <strong>Is Logged In:</strong> {userDetails?.loggedIn || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Cart Items */}
                    {cartItems.length > 0 ? (
                        <div className="mt-10 bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
                            <ul className="space-y-4">
                                {cartItems.map((item) => (
                                    <li key={item.product._id} className="border-b pb-4">
                                        <p>
                                            <strong>Product:</strong> {item.product.name}
                                        </p>
                                        <p>
                                            <strong>Quantity:</strong> {item.quantity}
                                        </p>
                                        <p>
                                            <strong>Price:</strong> ₹{item.product.price}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="mt-10 bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
                            <p>No items in the cart.</p>
                        </div>
                    )}

                    {/* Wishlist Items */}
                    {wishlistItems.length > 0 ? (
                        <div className="mt-10 bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Wishlist Items</h2>
                            <ul className="space-y-4">
                                {wishlistItems.map((item) => (
                                    <li key={item._id} className="border-b pb-4">
                                        <p>
                                            <strong>Product:</strong> {item.name}
                                        </p>
                                        <p>
                                            <strong>Price:</strong> ₹{item.price}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="mt-10 bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Wishlist Items</h2>
                            <p>No items in the wishlist.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SingleUser;