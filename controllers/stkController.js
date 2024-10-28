require('dotenv').config();
const getFormattedTimestamp = require('../utils/TimeStamp');
const generateToken = require('../utils/GenerateToken');


const stkPush = async (amount, number) => {
    const token = await generateToken();
    const passkey = process.env.PASS_KEY;
    const url = process.env.STK_URL;
    const shortcode = process.env.SHORTCODE;
    const timestamp = getFormattedTimestamp();
    const callbackURL = process.env.CALLBACK_URL;
    const stkPassword = Buffer.from(`174379${passkey}${timestamp}`).toString('base64');


    try {
        const body = {
            "BusinessShortCode": shortcode,
            "Password": stkPassword,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": number,
            "PartyB": shortcode,
            "PhoneNumber": number,
            "CallBackURL": callbackURL,
            "AccountReference": "Brown and Co.",
            "TransactionDesc": "Test"
        };


        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('STK Push API Response Error:', errorData);
            throw new Error(`STK Push failed: ${errorData}`);
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('Error in STK push request:');
    }
};

module.exports = stkPush;