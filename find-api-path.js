const axios = require('axios');

const BASE_URL = 'https://insightful-beauty-production-1f8b.up.railway.app';
const paths = [
    '/api/auth/login',
    '/auth/login',
    '/v1/auth/login',
    '/api/v1/auth/login',
    '/users/login',
    '/api/users/login',
    '/login',
    '/user/login'
];

async function scan() {
    console.log(`Scanning ${BASE_URL} for login route...`);

    for (const path of paths) {
        try {
            const url = `${BASE_URL}${path}`;
            console.log(`Trying POST ${url}...`);
            // Send dummy data to trigger 401/400 instead of 404 if route exists
            await axios.post(url, { email: 'test@test.com', password: 'test' });
            console.log(`✅ FOUND! ${path} responded with 200 (Success)`);
            return;
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    // console.log(`❌ ${path} -> 404 Not Found`);
                } else {
                    console.log(`✅ FOUND! ${path} responded with ${err.response.status} (Route exists!)`);
                    console.log(`Response data:`, err.response.data);
                    return;
                }
            } else {
                console.log(`⚠️ Error reaching ${path}: ${err.message}`);
            }
        }
    }
    console.log('❌ Scan complete. No working login route found.');
}

scan();
