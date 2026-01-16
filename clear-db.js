const axios = require('axios');

const API_URL = 'https://insightful-beauty-production-1f8b.up.railway.app/api';

async function clearDb() {
    try {
        console.log('Logging in to clear DB...');
        // Need to signup/login to get token
        const email = `cleaner${Date.now()}@example.com`;
        const password = 'password123';

        let token;
        try {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                username: 'Cleaner',
                email,
                password
            });
            token = signupRes.data.token;
        } catch (e) {
            console.log('Signup failed, assuming logic issues. Manual wipe recommended if this fails.');
            return;
        }

        if (!token) return;

        // List all
        const listRes = await axios.get(`${API_URL}/documents`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Found ${listRes.data.length} documents.`);

        for (const doc of listRes.data) {
            const id = doc._id || doc.id;
            if (id) {
                console.log(`Deleting ${id}...`);
                await axios.delete(`${API_URL}/documents/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                console.log('Skipping doc without ID:', doc);
            }
        }
        console.log('Done.');

    } catch (err) {
        console.error('Error:', err.message);
    }
}

clearDb();
