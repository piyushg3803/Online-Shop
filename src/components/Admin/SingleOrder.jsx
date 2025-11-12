import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function SingleOrder() {
    const { id } = useParams(); // Get the order ID from the URL
    const [isOpen, setIsOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/order/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const data = await response.json();
                setOrder(data.order);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch order details. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    if (loading) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md border-l-4 border-red-500">
                    <p className="text-xl text-red-500 mb-2">Error</p>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-8 font-jakarta">
            <button
                className="block md:hidden bg-teal-600 text-white text-center rounded-full m-4 w-28 p-2 fixed right-2 z-10"
                onClick={handlePanel}
            >
                {isOpen ? "Close Panel" : "Open Panel"}
            </button>
            <div className="flex h-full bg-teal-600">
                {/* Sidebar */}
                <div className={`fixed md:relative w-64 h-screen bg-teal-600 text-white flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-all duration-300`}>
                    <div className="p-6 text-2xl font-bold border-b border-teal-700">
                        Admin Panel
                    </div>
                    <nav className="flex-1 p-4">
                        <ul className="space-y-4">
                            <li className="hover:bg-teal-700 p-2 rounded transition">
                                <Link to="/admin" className="block">Dashboard</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded transition">
                                <Link to="/admin/userList" className="block">Registered Users</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded transition">
                                <Link to="/admin/orderList" className="block">Recent Orders</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded transition">
                                <Link to="/admin/productList" className="block">Product List</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded transition">
                                <Link to="/admin/addProduct" className="block">Add Product</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-4 md:p-6 overflow-y-auto min-h-screen">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-teal-600">Order Details</h1>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order #{order._id.slice(-6)}</h2>

                        {/* Customer Details */}
                        <div className="mb-6">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Customer Details</h3>
                            <p className="text-lg"><span className="font-medium">Name:</span> {order.user?.name || "Deleted User"}</p>
                            <p className="text-lg"><span className="font-medium">Email:</span> {order.user?.email || "Deleted User"}</p>
                            <p className="text-lg"><span className="font-medium">Phone:</span> {order.shippingAddress?.phone || "Not Provided"}</p>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Address Details</h3>
                            <p className="text-lg"><span className="font-medium">Address:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                            <p className="text-lg"><span className="font-medium">Pincode:</span> {order.shippingAddress?.pinCode || "No Pincode provided"}</p>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Order Items</h3>
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item._id}>
                                        <p className="text-lg"><span className="font-medium">Product Name:</span> {item.name}</p>
                                        <p className="text-lg"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                                        <p className="text-lg"><span className="font-medium">Price:</span> ₹{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment and Total */}
                        <div className="flex justify-between items-start mt-6 pt-4 border-t border-gray-200">
                            <div>
                                <p className="text-lg"><span className="font-medium">Payment Method:</span> {order.paymentInfo.type}</p>
                                <p className="text-lg"><span className="font-medium">Payment Status:</span> {order.paymentInfo.status}</p>
                            </div>
                            <p className="text-lg font-bold text-teal-600">Total: ₹{order.totalAmount}</p>
                        </div>

                        {/* Order Date */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Order Date: {formatDate(order.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleOrder;