import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function ProductList() {

    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const handlePanle = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('authToken')

                const response = await fetch('https://online-shop-backend-qpnv.onrender.com/api/product',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();
                setProduct(data.products);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch users. Please try again later.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (productId) => {
        try {

            const token = localStorage.getItem('authToken')

            await fetch(`https://online-shop-backend-qpnv.onrender.com/api/product/${productId}`, { // Replace with your API endpoint
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProduct(product.filter((product) => product._id !== productId));
            alert('Product deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to delete user. Please try again.');
        }
    };

    const showDetails = async (productId) => {
        navigate(`/admin/singleProduct/${productId}`); // Navigate to the SingleUser page with the userId
    };

    if (loading) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading Products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    return (
        <div className='pt-8 font-jakarta'>
            <div className='block md:hidden bg-teal-600 text-white text-center rounded-full m-4 w-28 p-2 right-2' onClick={handlePanle}>
                <p>{isOpen ? ("Close Panel") : ("Open Panel")}</p>
            </div>
            <div className="flex flex-col md:flex-row h-full bg-teal-600">
                {/* Sidebar */}
                <div className={`absolute h-screen md:relative md:translate-x-0 w-64 bg-teal-600 text-white flex flex-col ${isOpen ? ("translate-x-0") : ("-translate-x-full")} transition-all duration-100`}>
                    <div className="p-6 text-2xl font-bold border-b border-teal-700">
                        Admin Panel
                    </div>
                    <nav className="flex-1 p-4">
                        <ul className="space-y-4">
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to={"/admin"} className="block">Dashboard</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to={"/admin/userList"} className="block">Registered Users</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to={"/admin/orderList"} className="block">Recent Orders</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to={"/admin/productList"} className="block">Product List</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to={"/admin/addProduct"} className="block">Add Product</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6">Product List</h1>

                    {/* Users Table */}
                    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Price</th>
                                    <th className="border border-gray-300 p-2 text-left">Brand</th>
                                    <th className="border border-gray-300 p-2 text-left">Category</th>
                                    <th className="border border-gray-300 p-2 text-left">Stock</th>
                                    <th className="border border-gray-300 p-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2"> {product.name}</td>
                                        <td className="border border-gray-300 p-2">{product.price}</td>
                                        <td className="border border-gray-300 p-2">{product.brand}</td>
                                        <td className="border border-gray-300 p-2">{product.category}</td>
                                        <td className="border border-gray-300 p-2">{product.stock}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs md:text-sm"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => showDetails(product._id)}
                                                className="bg-teal-600 text-white mx-2 px-4 py-2 rounded-lg text-xs md:text-sm"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList