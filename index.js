require('dotenv').config();
const cors = require('cors');
const express = require('express');
const stkPush = require('./controllers/stkController');
const queryTransaction = require('./controllers/queryController');
const formatPhoneNumberServer = require('./utils/formatPhoneNumber');


// create server
const app = express();
const PORT = process.env.PORT || 3001;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



// STK Push Endpoint
app.post('/api/stk-push', async (req, res) => {
    console.log('stk push done');
    const {amount, number} = req.body;
    const formattedNumber = formatPhoneNumberServer(number);
    console.log(amount, formattedNumber);
    try {
        const response = await stkPush(amount,formattedNumber);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error processing STK push', error });
    }
});

// Query Transaction Status Endpoint
app.post('/api/query-transaction', async (req, res) => {
    const { checkoutRequestID } = req.body;

    try {
        const response = await queryTransaction(checkoutRequestID);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error querying transaction', error });
    }
});


// Listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
