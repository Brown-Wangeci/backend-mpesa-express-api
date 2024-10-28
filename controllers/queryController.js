const axios = require('axios');
const timestamp = require('../utils/TimeStamp');
const generateToken = require('../utils/GenerateToken');

const queryTransaction = async (checkoutRequestID) => {
    const token = await generateToken();
    const passkey = process.env.PASS_KEY;
    const url = process.env.QUERY_URL;
    const stkPassword = Buffer.from(`174379${passkey}${timestamp}`).toString('base64');

    try {
        const response = await axios.post(
            url,
            {
                BusinessShortCode: "174379",
                Password: stkPassword,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error querying transaction status:', error);
        throw error;
    }
};

module.exports = queryTransaction;
