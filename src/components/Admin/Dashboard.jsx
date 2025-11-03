import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]); // State for users
    const [orders, setOrders] = useState([]); // State for orders
    const [totalOrders, setTotalOrders] = useState(0); // State for total orders
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const handlePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');

                // Fetch users
                const usersResponse = await fetch('https://ecom-qybu.onrender.com/api/auth/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const usersData = await usersResponse.json();
                setUsers(usersData.data || []);

                // Fetch orders
                const ordersResponse = await fetch('https://ecom-qybu.onrender.com/api/order/admin/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const ordersData = await ordersResponse.json();
                setOrders(ordersData.orders.slice(0, 3)); // Get the last three orders
                setTotalOrders(ordersData.orders.length); // Total number of orders

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">

                    <p className="text-xl text-red-500 mb-2">Error</p>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-8 font-jakarta">
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
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                    {/* Registered Users */}
                    <section id="users" className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-lg">
                                Total Users: <span className="font-bold">{users.length}</span>
                            </p>
                            {users.length > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Last registered user: {users[users.length - 1].name} ({users[users.length - 1].email})
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Recent Orders */}
                    <section id="orders" className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
                        <div className="bg-white shadow rounded-lg p-6">
                            <ul className="space-y-4">
                                {orders.map((order) => (
                                    <li key={order._id} className="flex justify-between">
                                        <span>Order #{order._id.slice(-6)}</span>
                                        <span className="text-gray-600">₹{order.totalAmount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Total Orders */}
                    <section id="total-orders">
                        <h2 className="text-2xl font-semibold mb-4">Total Orders</h2>
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-lg">
                                Total Orders: <span className="font-bold">{totalOrders}</span>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;