const axios = require('axios');

const API_URL = 'hrgenie-backend-assignment-production.up.railway.app';

async function debug() {
    try {
        // 1. Sign up/Login to get token
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        console.log('Registering user...');
        let token;
        try {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                username: 'DebugUser',
                email,
                password
            });
            token = signupRes.data.token;
        } catch (e) {
            console.log('Signup failed, trying login (if user exists)');
            // Fallback to login if needed (not needed for random email)
        }

        if (!token) {
            console.error('Failed to get token');
            return;
        }

        console.log('Got token:', token.substring(0, 20) + '...');

        // 2. Create a document
        console.log('Creating document...');
        const createRes = await axios.post(`${API_URL}/documents`,
            { title: 'Debug Doc' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Create response data:', createRes.data);

        // 3. List documents
        console.log('Listing documents...');
        const listRes = await axios.get(`${API_URL}/documents`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('List response (first item):', listRes.data[0]);
        console.log('Keys of first item:', Object.keys(listRes.data[0]));

    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

debug();
