import { faCartShopping, faDashboard, faEye, faEyeSlash, faHeart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../Context/AuthContext';
import profile from '/profile-icon.png';
import ReactModal from 'react-modal';

function Profile() {
    const [signedUp, setSignedUp] = useState(true);
    const { logout, login } = useContext(AuthContext);
    const [profileDetails, setProfileDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [loginData, setLoginData] = useState({
        password: "",
        login: ""
    });
    const [error, setError] = useState("");
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [forgotPasswordMail, setForgotPasswordMail] = useState("");
    const [cartQuantity, setCartQuantity] = useState(0);
    const [wishListQuantity, setWishListQuantity] = useState(0);

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const handleLogout = async () => {
        try {
            const response = await fetch("https://ecom-kl8f.onrender.com/api/auth/user/logout", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.ok) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('profileDetails');
                logout();
                alert('User Logged Out Successfully!');
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to log out.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            setError(error.message || 'An error occurred during logout.');
        }
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (signedUp && signupData.phone.length !== 10) {
            setError("Phone number must be 10 digits.");
            return;
        }

        try {
            const endpoint = signedUp ? '/user/register' : '/user/login';
            const userData = signedUp ? signupData : loginData;

            const response = await fetch(`https://ecom-kl8f.onrender.com/api/auth${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                if (signedUp) {
                    alert('Sign Up Successful! Please log in.');
                    setSignedUp(false);
                } else {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userRole', data.user.role);
                    login(data.user);
                    alert('Login Successful!');
                    await handleProfile();
                }
            } else {
                setError(data.message || 'Invalid Inputs. Please enter the correct details.');
            }
        } catch (error) {
            setError(error.message || "An error occurred");
        }
    };

    useEffect(() => {
        if (token) {
            const storedProfile = localStorage.getItem("profileDetails");
            if (storedProfile) {
                setProfileDetails(JSON.parse(storedProfile));
            } else {
                handleProfile();
            }
        }
    }, [token]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/auth/user/profile-image', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                const updatedProfile = { ...profileDetails, profileImage: data.profileImage };
                setProfileDetails(updatedProfile);
                localStorage.setItem('profileDetails', JSON.stringify(updatedProfile));
                alert('Profile image updated successfully!');
            } else {
                setError(data.message || 'Failed to update profile image.');
            }
        } catch (error) {
            console.error("Error uploading image", error);
        }
    };

    const handleProfile = async () => {
        setLoading(true);

        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/auth/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            const details = await response.json();

            if (response.ok) {
                setProfileDetails(details.user);
                localStorage.setItem('profileDetails', JSON.stringify(details.user));
            } else {
                console.error("Failed to fetch profile details");
            }
        } catch (error) {
            console.error("Error occurred", error);
        } finally {
            setLoading(false);
        }
    }

    const updateQuantity = async () => {
        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/auth/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCartQuantity(data.user.cartQuantity);
                setWishListQuantity(data.user.watchlistQuantity);
            } else {
                console.log("Failed to fetch quantities");
            }
        }
        catch (error) {
            console.error("Error fetching quantities", error);

        }
    }

    useEffect(() => {
        if (token) {
            updateQuantity();
        }
    }, [token]);

    const openForgotPasswordModal = () => {
        setForgotPasswordModal(true);
    };

    const closeForgotPasswordModal = () => {
        setForgotPasswordModal(false);
        setForgotPasswordMail("");
    };

    const handleForgotPassword = async () => {
        if (!forgotPasswordMail) {
            setError("Please enter your email to reset the password.");
            return;
        }

        try {
            const response = await fetch('https://ecom-kl8f.onrender.com/api/auth/user/password-forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotPasswordMail }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password reset link has been sent to your email.');
                closeForgotPasswordModal();
            } else {
                setError(data.message || 'Failed to send password reset link.');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            setError(error.message || 'An error occurred while sending the reset link.');
        }
    };

    const handleAdmin = () => {
        navigate('/admin')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-teal-50 font-jakarta">
                <div className="text-center py-12 px-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-700 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-700 font-medium">Loading Your Profile...</p>
                    <p className="text-gray-500 mt-2">Just a moment while we fetch your details</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {!token ? (
                <div className="min-h-auto flex items-start justify-center py-28 px-4 sm:px-6 lg:px-8 bg-gray-50 font-jakarta">
                    <div className="max-w-md w-full space-y-8">
                        <form
                            className="bg-white shadow-sm rounded-3xl px-8 pt-8 pb-10 mb-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-teal-600 mb-2">
                                    {signedUp ? 'Create Account' : 'Welcome Back'}
                                </h1>
                                <p className="text-gray-500">
                                    {signedUp ? (
                                        <>
                                            Already have an account?{' '}
                                            <span
                                                className="text-teal-600 cursor-pointer hover:text-teal-800 font-medium"
                                                onClick={() => setSignedUp(false)}
                                            >
                                                Log in
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            First time here?{' '}
                                            <span
                                                className="text-teal-600 cursor-pointer hover:text-teal-800 font-medium"
                                                onClick={() => setSignedUp(true)}
                                            >
                                                Create an Account
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-50 p-4 mb-6 rounded-lg">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-5">
                                {signedUp && (
                                    <div>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="name"
                                            value={signupData.name}
                                            onChange={handleSignupChange}
                                            label="Username"
                                            type="text"
                                            autoComplete="off"
                                            required
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "#009689",
                                                        borderRadius: "0.5rem",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#009689",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#009689",
                                                },
                                                input: {
                                                    color: "#374151",
                                                },
                                            }}
                                        />
                                    </div>
                                )}

                                {signedUp && (
                                    <div>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="email"
                                            value={signupData.email}
                                            onChange={handleSignupChange}
                                            label="Email"
                                            type="email"
                                            autoComplete="off"
                                            required
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "#009689",
                                                        borderRadius: "0.5rem",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#009689",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#009689",
                                                },
                                                input: {
                                                    color: "#374151",
                                                },
                                            }}
                                        />
                                    </div>
                                )}

                                {!signedUp && (
                                    <div>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="login"
                                            value={loginData.login}
                                            onChange={handleLoginChange}
                                            label="Email or Phone"
                                            type="text"
                                            autoComplete="off"
                                            required
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "#009689",
                                                        borderRadius: "0.5rem",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#009689",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#009689",
                                                },
                                                input: {
                                                    color: "#374151",
                                                },
                                            }}
                                        />
                                    </div>
                                )}

                                {signedUp && (
                                    <div>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="phone"
                                            value={signupData.phone}
                                            onChange={handleSignupChange}
                                            label="Phone"
                                            type="number"
                                            autoComplete="off"
                                            required
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "#009689",
                                                        borderRadius: "0.5rem",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#009689",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#009689",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#009689",
                                                },
                                                input: {
                                                    color: "#374151",
                                                },
                                            }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="password"
                                        value={signedUp ? (signupData.password) : (loginData.password)}
                                        onChange={signedUp ? (handleSignupChange) : (handleLoginChange)}
                                        autoComplete="off"
                                        label="Password"
                                        required
                                        type={showPassword ? "text" : "password"}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#009689",
                                                    borderRadius: "0.5rem",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#009689",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#009689",
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "#009689",
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#009689",
                                            },
                                            input: {
                                                color: "#374151",
                                            },
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <FontAwesomeIcon
                                                        icon={showPassword ? faEyeSlash : faEye}
                                                        className="text-gray-500 cursor-pointer"
                                                        onClick={handlePassword}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {!signedUp && (
                                        <div className="mt-2 text-right">
                                            <span
                                                className="text-teal-600 cursor-pointer hover:text-teal-800 text-sm font-medium"
                                                onClick={openForgotPasswordModal}
                                            >
                                                Forgot Password?
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white bg-teal-600 hover:bg-teal-700 font-medium transition duration-200"
                                >
                                    {signedUp ? "Create Account" : "Sign In"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Forgot Password Modal */}
                    <ReactModal
                        isOpen={forgotPasswordModal}
                        onRequestClose={closeForgotPasswordModal}
                        className="fixed inset-0 flex items-center justify-center outline-none mx-4 font-jakarta"
                        overlayClassName="fixed inset-0 bg-teal-50 z-30"
                        ariaHideApp={false}
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                            <button
                                onClick={closeForgotPasswordModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold text-teal-700 mb-2">Reset Password</h2>
                            <p className="text-gray-600 mb-6">Enter your email address to receive a password reset link.</p>

                            <TextField
                                fullWidth
                                variant="outlined"
                                value={forgotPasswordMail}
                                onChange={(e) => setForgotPasswordMail(e.target.value)}
                                label="Email Address"
                                type="email"
                                autoComplete="off"
                                required
                                className="mb-6"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#009689",
                                            borderRadius: "0.5rem",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#009689",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#009689",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#009689",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#009689",
                                    },
                                    input: {
                                        color: "#374151",
                                    },
                                }}
                            />

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    onClick={closeForgotPasswordModal}
                                    className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleForgotPassword}
                                    className="py-2 px-4 bg-teal-600 text-white rounded-lg shadow font-medium"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                </div>
            ) : (
                <div className="min-h-auto bg-gray-50 py-28 px-4 sm:px-6 lg:px-8 font-jakarta">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white shadow-sm rounded-3xl overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg- px-6 py-8 sm:px-10 border-b border-gray-200">
                                <h1 className="text-3xl font-bold text-teal-600">Your Profile</h1>
                                <p className="text-gray-700 mt-1">Manage your account details and preferences</p>
                            </div>

                            {/* Profile Content */}
                            <div className="p-6 sm:p-10">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Left Column - Profile Image */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative group">
                                            <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-teal-100 bg-white shadow-md">
                                                <img
                                                    src={profileDetails?.profileImage || profile}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300">
                                                <label className="opacity-0 group-hover:opacity-100 cursor-pointer bg-white text-teal-600 py-2 px-4 rounded-lg shadow-md font-medium text-sm transform translate-y-5 group-hover:translate-y-0 transition-all duration-300">
                                                    Change Image
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-4">
                                            {profileDetails?.name || 'User'}
                                        </h2>
                                    </div>

                                    {/* Right Column - User Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Account Details</h3>

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                                    <div className="w-full sm:w-1/2">
                                                        <p className="text-sm text-gray-500">Email Address</p>
                                                        <p className="font-medium text-gray-800">{profileDetails?.email || 'user@example.com'}</p>
                                                    </div>
                                                    <div className="w-full sm:w-1/2">
                                                        <p className="text-sm text-gray-500">Phone Number</p>
                                                        <p className="font-medium text-gray-800">{profileDetails?.phone || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Shopping Activity</h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="bg-teal-50 rounded-xl p-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-teal-600">Items in Wishlist</p>
                                                            <p className="text-2xl font-bold text-teal-600">{wishListQuantity || 0}</p>
                                                        </div>
                                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100">
                                                            <FontAwesomeIcon icon={faHeart} className='text-teal-600' />
                                                        </div>
                                                    </div>

                                                    <div className="bg-teal-50 rounded-xl p-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-teal-700">Items in Cart</p>
                                                            <p className="text-2xl font-bold text-teal-600">{cartQuantity || 0}</p>
                                                        </div>
                                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100">
                                                            <FontAwesomeIcon icon={faCartShopping} className='text-teal-600' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                                            <button
                                                onClick={() => navigate('/cart')}
                                                className="py-3 px-4 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faCartShopping} className='text-white me-2' />
                                                Cart
                                            </button>
                                            <button
                                                onClick={() => navigate('/wishlist')}
                                                className="py-3 px-4 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faHeart} className='text-white me-2' />
                                                Wishlist
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="py-3 px-4 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} className='text-white me-2' />
                                                Logout
                                            </button>
                                            {profileDetails?.role === 'admin' &&
                                                <button
                                                    onClick={handleAdmin}
                                                    className="py-3 px-4 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 flex items-center justify-center"
                                                >
                                                    Admin Panel
                                                </button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;