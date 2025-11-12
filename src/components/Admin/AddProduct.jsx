import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AddProduct() {
    const [isOpen, setIsOpen] = useState(false);
    const [descriptions, setDescriptions] = useState([{ title: '', points: [''] }]);
    const [faqs, setFaqs] = useState([{ question: '', answer: [{ title: '', points: [''] }] }]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleAddDescription = () => {
        setDescriptions([...descriptions, { title: '', points: [''] }]);
    };

    const handleAddPointToDescription = (index) => {
        const updatedDescriptions = [...descriptions];
        updatedDescriptions[index].points.push('');
        setDescriptions(updatedDescriptions);
    };

    const handleDescriptionChange = (index, field, value, pointIndex = null) => {
        const updatedDescriptions = [...descriptions];
        if (field === 'points') {
            updatedDescriptions[index].points[pointIndex] = value;
        } else {
            updatedDescriptions[index][field] = value;
        }
        setDescriptions(updatedDescriptions);
    };

    const handleAddFaq = () => {
        setFaqs([...faqs, { question: '', answer: [{ title: '', points: [''] }] }]);
    };

    const handleAddAnswerTitle = (faqIndex) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[faqIndex].answer.push({ title: '', points: [''] });
        setFaqs(updatedFaqs);
    };

    const handleAddPointToAnswer = (faqIndex, answerIndex) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[faqIndex].answer[answerIndex].points.push('');
        setFaqs(updatedFaqs);
    };

    const handleFaqChange = (faqIndex, field, value, answerIndex = null, pointIndex = null) => {
        const updatedFaqs = [...faqs];
        if (field === 'points') {
            updatedFaqs[faqIndex].answer[answerIndex].points[pointIndex] = value;
        } else if (field === 'title') {
            updatedFaqs[faqIndex].answer[answerIndex].title = value;
        } else {
            updatedFaqs[faqIndex][field] = value;
        }
        setFaqs(updatedFaqs);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        // Create FormData object
        const productData = new FormData();
        
        // Add basic product information
        productData.append('name', e.target.name.value);
        productData.append('price', e.target.price.value);
        productData.append('brand', e.target.brand.value);
        productData.append('category', e.target.category.value);
        productData.append('stock', e.target.stock.value);
        productData.append('download_url', e.target.download_url.value);
        
        // Format descriptions and FAQs exactly as expected by the backend
        // The backend expects these as JSON strings
        productData.append('description', JSON.stringify(descriptions));
        productData.append('faqs', JSON.stringify(faqs));

        // Append images to FormData - each as a separate file with the same field name
        images.forEach((image) => {
            productData.append('productImages', image);
        });

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://online-shop-backend-qpnv.onrender.com/api/product/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: productData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Product added successfully!');
                console.log('Product added successfully:', data);
                
                // Reset form after successful submission
                e.target.reset();
                setDescriptions([{ title: '', points: [''] }]);
                setFaqs([{ question: '', answer: [{ title: '', points: [''] }] }]);
                setImages([]);
            } else {
                setErrorMessage(data.message || 'Failed to add product');
                console.error('Error adding product:', data);
            }
        } catch (error) {
            setErrorMessage('An error occurred while adding the product');
            console.error('Network error:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    className={`absolute h-screen md:relative md:translate-x-0 w-64 bg-teal-600 text-white flex flex-col ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-all duration-100`}
                >
                    <div className="p-6 text-2xl font-bold border-b border-teal-700">Admin Panel</div>
                    <nav className="flex-1 p-4">
                        <ul className="space-y-4">
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin" className="block">Dashboard</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/userList" className="block">Registered Users</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/orderList" className="block">Recent Orders</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/productList" className="block">Product List</Link>
                            </li>
                            <li className="hover:bg-teal-700 p-2 rounded">
                                <Link to="/admin/addProduct" className="block">Add Product</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6">Add Product</h1>

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                        {/* Basic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Download URL</label>
                                <input
                                    type="text"
                                    name="download_url"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                            
                            {images.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">Selected Images:</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <div className="h-24 w-24 border rounded-lg overflow-hidden">
                                                    <img 
                                                        src={URL.createObjectURL(image)} 
                                                        alt={`Selected ${index}`} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descriptions */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Descriptions</h2>
                            {descriptions.map((desc, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={desc.title}
                                        onChange={(e) =>
                                            handleDescriptionChange(index, 'title', e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                                        required
                                    />
                                    <label className="block text-gray-700 font-semibold mb-2">Points</label>
                                    {desc.points.map((point, pointIndex) => (
                                        <div key={pointIndex} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                value={point}
                                                onChange={(e) =>
                                                    handleDescriptionChange(index, 'points', e.target.value, pointIndex)
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {pointIndex > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedDesc = [...descriptions];
                                                        updatedDesc[index].points.splice(pointIndex, 1);
                                                        setDescriptions(updatedDesc);
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-3 py-2 rounded-lg"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAddPointToDescription(index)}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            Add Point
                                        </button>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedDescriptions = [...descriptions];
                                                    updatedDescriptions.splice(index, 1);
                                                    setDescriptions(updatedDescriptions);
                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Remove Section
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddDescription}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                            >
                                Add Description Section
                            </button>
                        </div>

                        {/* FAQs */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">FAQs</h2>
                            {faqs.map((faq, faqIndex) => (
                                <div key={faqIndex} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <label className="block text-gray-700 font-semibold mb-2">Question</label>
                                    <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) => handleFaqChange(faqIndex, 'question', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                                        required
                                    />
                                    <h3 className="text-lg font-semibold mb-2">Answers</h3>
                                    {faq.answer.map((answer, answerIndex) => (
                                        <div key={answerIndex} className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={answer.title}
                                                onChange={(e) =>
                                                    handleFaqChange(faqIndex, 'title', e.target.value, answerIndex)
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                                                required
                                            />
                                            <label className="block text-gray-700 font-semibold mb-2">Points</label>
                                            {answer.points.map((point, pointIndex) => (
                                                <div key={pointIndex} className="flex items-center mb-2">
                                                    <input
                                                        type="text"
                                                        value={point}
                                                        onChange={(e) =>
                                                            handleFaqChange(
                                                                faqIndex,
                                                                'points',
                                                                e.target.value,
                                                                answerIndex,
                                                                pointIndex
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg p-2"
                                                        required
                                                    />
                                                    {pointIndex > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updatedFaqs = [...faqs];
                                                                updatedFaqs[faqIndex].answer[answerIndex].points.splice(pointIndex, 1);
                                                                setFaqs(updatedFaqs);
                                                            }}
                                                            className="ml-2 bg-red-500 text-white px-3 py-2 rounded-lg"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <div className="flex space-x-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddPointToAnswer(faqIndex, answerIndex)}
                                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Add Point
                                                </button>
                                                {answerIndex > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updatedFaqs = [...faqs];
                                                            updatedFaqs[faqIndex].answer.splice(answerIndex, 1);
                                                            setFaqs(updatedFaqs);
                                                        }}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Remove Answer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAddAnswerTitle(faqIndex)}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            Add Answer
                                        </button>
                                        {faqIndex > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedFaqs = [...faqs];
                                                    updatedFaqs.splice(faqIndex, 1);
                                                    setFaqs(updatedFaqs);
                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Remove FAQ
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddFaq}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                            >
                                Add FAQ
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg w-full flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>Adding Product...</span>
                            ) : (
                                <span>Add Product</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;