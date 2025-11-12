import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the token from the URL
    const token = useParams().token || new URLSearchParams(location.search).get('token');
    console.log(token); // Log the token for debugging
    

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`https://online-shop-backend-qpnv.onrender.com/api/auth/user/password-reset/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword, confirmPassword }),
            });

            console.log('Raw Response:', response);
            const data = await response.json();


            if (response.ok) {
                setSuccess('Password reset successful! You can now log in with your new password.');
                setTimeout(() => navigate('/profile'), 3000); // Redirect to login page after 3 seconds
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('An error occurred while resetting the password.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 font-jakarta">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
                <form onSubmit={handlePasswordReset}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;