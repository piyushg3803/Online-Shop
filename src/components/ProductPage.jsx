import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "/src/index.css";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductPage() {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [success, setSuccess] = useState('');
    const [showCheckoutForm, setCheckoutFrom] = useState(false);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');
    const [showOrderConfirmation, setshowOrderConfirmation] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const { id } = useParams(); // Get the product ID from the URL

    useEffect(() => {
        const loadProduct = async () => {
            try {
                // Fetch product
                const productResponse = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/product/${ id }`);
                if (!productResponse.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData = await productResponse.json();
                setProduct(productData.product);

                // Fetch reviews (wrapped in try-catch block)
                try {
                    const reviewResponse = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/product/reviews/${ id }`);
                    if (reviewResponse.ok) {
                        const reviewData = await reviewResponse.json();
                        setReviews(reviewData.reviews || []);
                    } else {
                        // If there's no review, set to empty (but don't crash)
                        setReviews([]);
                    }
                } catch (reviewError) {
                    console.warn('No reviews available:', reviewError.message);
                    setReviews([]); // Default to empty if fetch fails
                }

            } catch (error) {
                console.error(error);
                setError("Failed to load product. Please try again later.");
            }
        };

        loadProduct();
    }, [id]);


    const generateStar = (rating) => {
        const numOfStars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            numOfStars.push(
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" key={i} />
            );
        }
        return numOfStars;
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        console.log("Review Being submitted");


        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You need to log in to submit a review.');

            return;
        }
        else {
            console.log("You are authenticated");
        }

        try {
            const response = await fetch(
                `https://online-shop-backend-qpnv.onrender.com/api/product/reviews/${ id }`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${ token }`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment, rating }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                window.location.reload();

                // Add the new review to the reviews state
                setReviews([...reviews, data.review]);
                setComment('');
                setRating(5);
                setSuccess('Review submitted successfully!');
                console.log("Submitted the review");
                
            } else {
                const errorData = await response.json();
                console.error(errorData);
                setError('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Error Occured while submitting the review. Please try again.');
        }
    };

    if (error) {
        return <div className="text-center text-red-500 py-28">{error}</div>;
    }

    if (!product) {
        return (
            <div className="pt-28 flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center py-8 px-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading Product...</p>
                </div>
            </div>);
    }

    const handleCheckout = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You need to log in to place an order.');
            return;
        }

        if (!street || !city || !state || !pincode || !phone) {
            alert('Please fill in all the fields.');
            return;
        }

        const orderData = {
            items: [
                {
                    product: product._id,
                    quantity: 1,
                },
            ],
            shippingAddress: {
                street: street,
                city: city,
                state: state,
                pinCode: pincode,
                phone: phone,
            },
            paymentInfo: {
                id: "mock-payment-id",
                status: "success",
                type: "card"
            }
        };

        try {
            const response = await fetch(
                'https://online-shop-backend-qpnv.onrender.com/api/order/create',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${ token }`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const order = data.order;

                setOrderDetails(order);
                setshowOrderConfirmation(true);

                const productLink = product?.download_url;
                if (productLink) {
                    setTimeout(() => {
                        window.location.href = productLink;
                    }, 2000);
                }
                setStreet('');
                setCity('');
                setState('');
                setPincode('');
                setPhone('');
                setCheckoutFrom(false);
            } else {
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error.message);
            alert('Failed to place order. Please try again.');
        }
    };

    const handleFavs = async () => {
        try {
            const token = localStorage.getItem("authToken")
            if (!token) {
                alert("You need to log in to add product to watchlist!");
                return;
            }
            const response = await axios.post(`https://online-shop-backend-qpnv.onrender.com/api/auth/user/watchlist/${ id }`, {
                productId: id,
            },
                {
                    headers: {
                        Authorization: `Bearer ${ token }`
                    }
                });

            console.log('Product added to wishlist:', response.data);
            alert("Product Added to Wishlist")

        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("Product already in wishlist")
            }
            else {
                console.error('Error adding product to wishlist:', error);
                alert("Error adding product to wishlist. Please try again.")
            }
        }
    };


    return (
        <>
            {/* Main Product Section with enhanced UI */}
            <div className="pt-20 pb-16 bg-gray-50 font-jakarta">
                <div className="max-w-7xl mx-auto">
                    {/* Product Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left side - Product Images */}
                            <div className="w-full lg:w-1/2 p-4 lg:p-6">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <Swiper
                                        slidesPerView={1}
                                        spaceBetween={20}
                                        loop={true}
                                        autoplay={{
                                            delay: 5000,
                                            disableOnInteraction: false,
                                        }}
                                        pagination={{
                                            clickable: true,
                                            dynamicBullets: true,
                                        }}
                                        navigation={true}
                                        modules={[Pagination, Navigation, Autoplay]}
                                        className="mySwiper rounded-lg"
                                    >
                                        {product.productImages.map((imageObj, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="aspect-w-16 aspect-h-9">
                                                    <img
                                                        src={imageObj.url}
                                                        alt={`${ product.name } - ${ index + 1 }`}
                                                        className="object-contain w-full h-96 rounded-lg hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            {/* Right side - Product Details */}
                            <div className="w-full lg:w-1/2 p-6 flex flex-col justify-between space-y-6">
                                {/* Product title and rating */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-lg">
                                            {generateStar(product.ratings)}
                                        </div>
                                        <span className="ml-2 text-gray-600">({product.numReviews} Reviews)</span>
                                    </div>
                                </div>

                                {/* Product details */}
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-sm">Price</span>
                                        <span className="text-3xl font-bold text-teal-600">₹{product.price}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Brand</span>
                                            <span className="font-medium">{product.brand}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Category</span>
                                            <span className="font-medium">{product.category}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Stock</span>
                                            <span className="font-medium">{product.stock > 0 ?
                                                <span className="text-green-600">In Stock ({product.stock})</span> :
                                                <span className="text-red-600">Out of Stock</span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button
                                        onClick={() => setCheckoutFrom(true)}
                                        className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                                        disabled={product.stock <= 0}
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                                        Buy Now
                                    </button>
                                    <button onClick={handleFavs} className="bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50 py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faHeart} className="mr-2" />
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description and FAQ Sections */}
                    <div className="mt-12 grid md:grid-cols-2 gap-8">
                        {/* Description Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                Product Description
                            </h2>
                            <div className="space-y-6">
                                {product.description.map((descriptionObj, index) => (
                                    <div className="mb-4" key={index}>
                                        <h3 className="font-semibold text-xl text-teal-700 mb-2">
                                            {descriptionObj.title}
                                        </h3>
                                        {descriptionObj.points && descriptionObj.points.length > 0 ? (
                                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                                {descriptionObj.points.map((point, pointIndex) => (
                                                    <li key={pointIndex}>{point}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No details available for this section.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {product.faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-gray-100 last:border-b-0">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            className="w-full text-left py-4 flex justify-between items-center font-medium text-gray-800 hover:text-teal-600 transition duration-300"
                                        >
                                            <span>{faq.question}</span>
                                            <span className="text-xl text-teal-600">
                                                {expandedFaq === index ? '−' : '+'}
                                            </span>
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="pl-4 pb-4 text-gray-600">
                                                {faq.answer.map((answer, answerIndex) => (
                                                    <div key={answerIndex} className="mb-3">
                                                        <h4 className="font-medium text-teal-700 mb-1">{answer.title}</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {answer.points.map((point, pointIndex) => (
                                                                <li key={pointIndex}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                            Customer Reviews
                        </h2>

                        {/* Display Existing Reviews */}
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-4 mb-8">
                                {reviews.map((review, index) => (
                                    <div key={index} className="p-4 border border-gray-100 rounded-lg hover:border-teal-200 transition duration-300">
                                        {/* User Information and Rating */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center mr-3">
                                                    <span className="text-white font-bold">
                                                        {review.user && review.user.name ? review.user.name.charAt(0).toUpperCase() : 'A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{review.user && review.user.name ? review.user.name : 'Anonymous'}</p>
                                                    <div className="flex items-center">
                                                        {review.rating ? generateStar(review.rating) : null}
                                                        <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Review Comment */}
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}

                        {/* Add Review Form */}
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-500 mb-4">{success}</p>}

                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Rating</label>
                                    <div className="flex items-center">
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="border border-gray-300 rounded-lg p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                                        >
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <option key={star} value={star}>
                                                    {star} {star === 1 ? 'Star' : 'Stars'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Review</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                                        rows="4"
                                        placeholder="Share your thoughts about this product..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition duration-300"
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Form Modal */}
            {showCheckoutForm && (
                <div className="fixed inset-0 bg-teal-50 flex justify-center items-center z-50 p-4 font-jakarta">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in-down">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Details</h2>

                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-200 focus:border-teal-500"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder="Enter your street address"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-200 focus:border-teal-500"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">State</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-200 focus:border-teal-500"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="State"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Pincode</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-200 focus:border-teal-500"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        placeholder="Pincode"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-200 focus:border-teal-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Phone number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg transition duration-300 flex-1"
                                >
                                    Place Order
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCheckoutFrom(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Confirmation Modal */}
            {showOrderConfirmation && (
                <div className="fixed inset-0 bg-teal-50 flex justify-center items-center z-50 p-4 font-jakarta">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in-down">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
                            <p className="text-gray-600 mt-1">Your order has been placed successfully</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p className="text-gray-500">Order ID:</p>
                                <p className="font-medium text-right">{orderDetails._id}</p>

                                <p className="text-gray-500">Total Amount:</p>
                                <p className="font-medium text-right">₹{orderDetails.totalAmount}</p>

                                <p className="text-gray-500">Status:</p>
                                <p className="font-medium text-right text-green-600">{orderDetails.status}</p>

                                <p className="text-gray-500">Payment Date:</p>
                                <p className="font-medium text-right">{new Date(orderDetails.paidAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setshowOrderConfirmation(false)}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg transition duration-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductPage;