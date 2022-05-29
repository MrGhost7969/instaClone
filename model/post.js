const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const postSchema = new mongoose.Schema({
    title: String,
    photo: {
        data: Buffer,
        contentType: String
    },
    content: String
});

module.exports = mongoose.model('Post', postSchema)