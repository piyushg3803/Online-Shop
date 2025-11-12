import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function SingleProduct() {
    const { id } = useParams(); // Get the product ID from the URL
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state

    const handlePanel = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const token = localStorage.getItem('authToken');

                const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const data = await response.json();
                setProductDetails(data.product);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch product details. Please try again later.');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const deleteReview = async (reviewId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://online-shop-backend-qpnv.onrender.com//api/product/${id}/review/auth${reviewId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            // Remove the deleted review from the state
            setProductDetails((prevDetails) => ({
                ...prevDetails,
                reviews: prevDetails.reviews.filter((review) => review._id !== reviewId),
            }));
            alert('Review deleted successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to delete review. Please try again.');
        }
    };

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }

    if (loading) {
        return (
            <div className="pt-20 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading Product Details...</p>
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
                        <h1 className="text-3xl font-bold mb-6">Product Details</h1>

                        {/* Product Images */}
                        {productDetails?.images?.length > 0 && (
                            <div className="flex gap-4 mb-6 overflow-x-auto">
                                {productDetails.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={`Product Image ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-lg shadow"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Product Details */}
                        <div className='flex flex-col md:flex-row '>
                            <div className="space-y-4">
                                <p className="text-lg">
                                    <strong>Name:</strong> {productDetails?.name || 'N/A'}
                                </p>
                                <p className="text-lg">
                                    <strong>Price:</strong> ₹{productDetails?.price || 'N/A'}
                                </p>
                                <p className="text-lg">
                                    <strong>Category:</strong> {productDetails?.category || 'N/A'}
                                </p>
                                <p className="text-lg">
                                    <strong>Brand:</strong> {productDetails?.brand || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-4 mt-4 md:mt-0 md:ms-20">
                                <p className="text-lg">
                                    <strong>Stock:</strong> {productDetails?.stock || 'N/A'}
                                </p>
                                <p className="text-lg">
                                    <strong>Ratings:</strong> {productDetails?.ratings || 'N/A'} Stars ({productDetails?.numReviews} Reviews)
                                </p>
                                <p className="text-lg">
                                    <strong>Created By:</strong> {productDetails?.createdUser.name || 'N/A'}
                                </p>
                                <p className="text-lg">
                                    <strong>Date Created:</strong> {new Date(productDetails?.createdAt).toLocaleDateString('en-IN', options) || 'N/A'}

                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-10 bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                        {productDetails?.reviews?.length > 0 ? (
                            <ul className="space-y-4">
                                {
                                    productDetails.reviews.map((review) => (
                                        <li key={review._id} className="border-b pb-4">
                                            <p>
                                                <strong>User:</strong> {review.user.name}
                                            </p>
                                            <p>
                                                <strong>Rating:</strong> {review.rating} Stars
                                            </p>
                                            <p>
                                                <strong>Comment:</strong> {review.comment}
                                            </p>
                                            <p>
                                                <strong>Review Created:</strong> {new Date(review.createdAt).toLocaleDateString('en-IN', options)}
                                            </p>
                                            <button
                                                onClick={() => deleteReview(review._id)}
                                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Delete Review
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        ) : (
                            <p className="text-gray-500">No reviews available for this product.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;