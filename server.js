// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const tokenSchema = new mongoose.Schema({
    token: String,
    email: String,
    createdAt: { type: Date, expires: '4h', default: Date.now }
});

const Token = mongoose.model('Token', tokenSchema);

app.use(express.json());

app.post('/generate-token', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    // Generate the token and store it in the database with the email
    const token = new Token({ token: generateToken(), email });
    await token.save();
    res.status(200).send({ token: token.token });
});


app.get('/validate-token', async (req, res) => {
    const { token,email } = req.query;
    if (!email || !token) {
        return res.status(400).send({ valid: false, error: 'Token and email are required' });
    }

    // Find the token associated with the email
    const foundToken = await Token.findOne({ token, email });

    if (foundToken) {
        res.status(200).send({ valid: true });
    } else {
        res.status(400).send({ valid: false });
    }
});

function validateReceipt(receipt) {
    // Implement your receipt validation logic here
    return true; // Assuming the receipt is valid for demonstration purposes
}

function generateToken() {
    return Math.random().toString(36).substr(2);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
