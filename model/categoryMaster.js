const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, // Make parent optional
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;