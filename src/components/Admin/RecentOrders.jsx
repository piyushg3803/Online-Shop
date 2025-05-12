import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function RecentOrders() {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePanel = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://ecom-kl8f.onrender.com/api/order/admin/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
        console.log(data.orders);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const navigateToDetails = (orderId) => () => {
    window.location.href = `/admin/orderdetails/${orderId}`;
  };

  if (loading) {
    return (
      <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading orders...</p>
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
              <li className="bg-teal-700 p-2 rounded">
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
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-teal-600">Recent Orders</h1>

          {/* Orders Cards for Mobile */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow rounded-lg p-4 border-l-4 border-teal-600">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-sm text-teal-600">Order #{order._id.slice(-6)}</span>
                  <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                </div>
                <div className="mb-2">
                  <p className="text-sm"><span className="font-medium">Customer:</span> {order.user?.name || "Deleted User"}</p>

                  <p className="text-sm"><span className="font-medium">Email:</span> {order.user?.email || "Deleted User"}</p>
                  <p className="text-sm"><span className="font-medium">Status:</span>
                    <span className={`ml-1 ${order.status === 'downloaded' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="font-medium text-sm mb-1">Items:</p>
                  {order.items.map((item, index) => (
                    <div key={item._id} className="pl-2 text-sm py-1 border-l-2 border-gray-200">
                      {item.name} x{item.quantity} - ₹{item.price}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                  <span className="text-sm">Payment: {order.paymentInfo.type}</span>
                  <span className="font-bold text-teal-600">₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Table for Desktop */}
          <div className="hidden md:block bg-white shadow rounded-lg p-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-teal-50 text-left">
                  <th className="p-3 font-semibold text-teal-600 border-b-2 border-teal-100">Order ID</th>
                  <th className="p-3 font-semibold text-teal-600 border-b-2 border-teal-100">Customer</th>
                  <th className="p-3 font-semibold text-teal-600 border-b-2 border-teal-100">Items</th>
                  <th className="p-3 font-semibold text-teal-600 border-b-2 border-teal-100">Total</th>
                  <th className="p-3 font-semibold text-teal-600 border-b-2 border-teal-100">Status</th>
                  <th className="p-3 font-semibold text-teal-600 border-b-2 border-teal-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="p-3 text-sm">{order._id.slice(-6)}</td>
                    <td className="p-3">
                      <div className="text-sm font-medium">{order.user?.name || "Deleted User"}</div>
                      <div className="text-xs text-gray-500">{order.user?.email || "Deleted User"}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="mb-1">
                            {item.name} <span className="text-gray-500">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-medium">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'downloaded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500"><button onClick={navigateToDetails(order._id)} className='bg-teal-600 p-2 rounded-sm text-white'>Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentOrders;