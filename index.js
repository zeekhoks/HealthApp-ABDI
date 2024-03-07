const express = require("express");
const app = require('./src/app');
require('dotenv').config();

app.use(express.json());

const PORT = process.env.APP_PORT || '8080';

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
})