const mongoose = require("mongoose")

const CreateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogimg: {
        type: String,
        required: false
    },

    blogDescription: {
        type: String,
        required: true
    },

    number: {
        type: String,
        required: false
    },

    
    author: {
        type: String,
        required: false
    },

    blogCategory: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Createblog", CreateSchema); 