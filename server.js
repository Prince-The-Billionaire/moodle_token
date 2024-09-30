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
    createdAt: { type: Date, expires: '24h', default: Date.now }
});

const Token = mongoose.model('Token', tokenSchema);

app.use(express.json());

app.post('/generate-token', async (req, res) => {
    const { receipt } = req.body;
    if (validateReceipt(receipt)) {
        const token = new Token({ token: generateToken() });
        await token.save();
        res.status(200).send({ token: token.token });
    } else {
        res.status(400).send({ error: 'Invalid receipt' });
    }
});

app.get('/validate-token', async (req, res) => {
    const { token } = req.query;
    const Tokens = await Token.find();
    const foundToken = Tokens.find((item) => item.token === token);
    
    //console.log(Tokens)
    //console.log(foundToken)
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
