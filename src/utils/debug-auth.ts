// Debug utility to check authentication status
export const debugAuth = () => {
    console.log('🔍 Auth Debug Info:');

    // Check localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('📱 LocalStorage:');
    console.log('  - accessToken:', accessToken ? `${accessToken.substring(0, 20)}...` : 'Not found');
    console.log('  - refreshToken:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Not found');

    // Check sessionStorage
    const sessionAccessToken = sessionStorage.getItem('accessToken');
    const sessionRefreshToken = sessionStorage.getItem('refreshToken');

    console.log('💾 SessionStorage:');
    console.log('  - accessToken:', sessionAccessToken ? `${sessionAccessToken.substring(0, 20)}...` : 'Not found');
    console.log('  - refreshToken:', sessionRefreshToken ? `${sessionRefreshToken.substring(0, 20)}...` : 'Not found');

    // Check cookies
    const cookies = document.cookie;
    console.log('🍪 Cookies:', cookies || 'No cookies found');

    // Check if user data exists
    const userData = localStorage.getItem('user');
    console.log('👤 User Data:', userData ? JSON.parse(userData) : 'Not found');

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasSessionAccessToken: !!sessionAccessToken,
        hasSessionRefreshToken: !!sessionRefreshToken,
        hasUserData: !!userData,
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};

// Test API call with current auth
export const testAuthAPI = async () => {
    try {
        const response = await fetch('/api/client/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        console.log('🧪 Auth Test API Response:');
        console.log('  - Status:', response.status);
        console.log('  - Headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('  - Data:', data);

        return { success: response.ok, status: response.status, data };
    } catch (error) {
        console.error('❌ Auth Test API Error:', error);
        return { success: false, error };
    }
};
