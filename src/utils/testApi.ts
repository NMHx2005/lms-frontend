// API Test Utility
import { UserService } from '../services/admin/userService';

export const testUserAPI = async () => {
    console.log('🧪 Testing User API...');

    try {
        // Test 1: Get users with pagination
        console.log('📋 Test 1: Get users with pagination');
        const usersResponse = await UserService.getUsers({
            page: 1,
            limit: 5,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });

        if (usersResponse.success) {
            console.log('✅ Users API success:', {
                totalUsers: usersResponse.data.total,
                currentPage: usersResponse.data.page,
                usersCount: usersResponse.data.users.length,
                firstUser: usersResponse.data.users[0]?.name
            });
        } else {
            console.error('❌ Users API failed:', usersResponse.error);
        }

        // Test 2: Get user stats
        console.log('📊 Test 2: Get user stats');
        const statsResponse = await UserService.getUserStats();

        if (statsResponse.success) {
            console.log('✅ Stats API success:', {
                totalUsers: statsResponse.data.totalUsers,
                activeUsers: statsResponse.data.activeUsers,
                usersByRole: statsResponse.data.usersByRole
            });
        } else {
            console.error('❌ Stats API failed:', statsResponse.error);
        }

        // Test 3: Search users
        console.log('🔍 Test 3: Search users');
        const searchResponse = await UserService.searchUsers('admin', 3);

        if (searchResponse.success) {
            console.log('✅ Search API success:', {
                searchResults: searchResponse.data.length,
                results: searchResponse.data.map(u => ({ name: u.name, roles: u.roles }))
            });
        } else {
            console.error('❌ Search API failed:', searchResponse.error);
        }

        console.log('🎉 All API tests completed!');
        return true;

    } catch (error: any) {
        console.error('❌ API Test Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return false;
    }
};

// Test authentication
export const testAuth = () => {
    console.log('🔐 Testing Authentication...');

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('Token Status:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0
    });

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
    };
};

// Run all tests
export const runAllTests = async () => {
    console.log('🚀 Starting API Integration Tests...');

    const authStatus = testAuth();

    if (!authStatus.hasAccessToken) {
        console.warn('⚠️ No access token found. Please login first.');
        return false;
    }

    const apiTestResult = await testUserAPI();

    console.log('📋 Test Summary:', {
        auth: authStatus,
        api: apiTestResult
    });

    return apiTestResult;
};

// Make functions available in console for manual testing
if (typeof window !== 'undefined') {
    (window as any).testAPI = {
        testUserAPI,
        testAuth,
        runAllTests
    };

    console.log('🔧 Test functions available in console:');
    console.log('- testAPI.runAllTests() - Run all tests');
    console.log('- testAPI.testUserAPI() - Test user APIs only');
    console.log('- testAPI.testAuth() - Test authentication status');
}
