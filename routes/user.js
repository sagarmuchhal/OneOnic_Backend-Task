const express = require('express');
const router = express.Router();
const UserMaster = require('../model/usermaster');
const Category = require('../model/categoryMaster');
const Product = require('../model/productMaster');
const multer = require('multer');
const path = require('path');


// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images'); // Save images in public/images folder
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename
    }
});

// Init multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10MB)
    fileFilter: function(req, file, cb) {
        // Allowed file extensions
        const filetypes = /jpg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
}).single('img'); // Single file upload with field name 'img'

/******************************************************
 * @register_user
 * @route POST http://localhost:8000/user/register_user
 * @description Create a new User
 * @returns Object of New User
 ******************************************************/
router.post('/register_user', async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new UserMaster({
            username,
            email,
            password,
        });
        await user.save();
        res.status(200).json({ message: 'User Added Successfully...', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error...' });
    }
});

/******************************************************
 * @login
 * @route POST http://localhost:8000/user/login
 * @description Login for user
 * @returns Login Success Message
 ******************************************************/
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserMaster.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Login Success.....' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/******************************************************
 * @logout
 * @route POST http://localhost:8000/user/logout
 * @description Logout User
 * @returns Logout Message
 ******************************************************/
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
});

/******************************************************
 * @add_category
 * @route POST http://localhost:8000/user/add_category
 * @description Create New Category
 * @returns Object of New Category
 ******************************************************/
router.post('/add_category', async(req, res) => {
    try {
        const { name, parent } = req.body;
        const category = new Category({
            name,
            parent
        });
        await category.save();
        res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/******************************************************
 * @get_categories
 * @route GET http://localhost:8000/user/get_categories
 * @description Display All Categories
 * @returns Object of All Categories
 ******************************************************/
router.get('/get_categories', async(req, res) => {
    try {
        const categories = await Category.find({}).populate({
            path: 'parent',
            populate: {
                path: 'parent',
                populate: {
                    path: 'parent'
                }
            }
        });
        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/******************************************************
 * @edit_category/:id
 * @route PUT http://localhost:8000/user/edit_category/:id
 * @description Update a Exists Category
 * @returns Object updated category
 ******************************************************/
router.put('edit_category/:id', async(req, res) => {
    try {
        const { name, parent } = req.body;
        const categoryId = req.params.id;
        const category = await Category.findByIdAndUpdate(categoryId, { name, parent }, { new: true });
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/******************************************************
 * @delete_category/:id
 * @route DELETE http://localhost:8000/user/delete_category/:id
 * @description  Delete a Category
 * @returns Message for Delete
 ******************************************************/
router.delete('delete_category/:id', async(req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/******************************************************
 * @add_product
 * @route POST http://localhost:8000/user/add_product
 * @description Create a New Product
 * @returns Object a new Product
 ******************************************************/
router.post('/add_product', (req, res) => {
    upload(req, res, async(err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File size too large' });
            } else if (err) {
                return res.status(400).json({ message: err });
            }
            const { name, category, price } = req.body;
            const img = req.file ? '/images/' + req.file.filename : ''; // Path to uploaded image
            const product = new Product({
                name,
                category,
                price,
                img
            });
            await product.save();
            res.status(201).json({ message: 'Product added successfully', product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
});

/******************************************************
 * @edit_product/:id
 * @route PUT http://localhost:8000/user/edit_product/:id
 * @description Update a Exists Product
 * @returns Object updated product
 ******************************************************/
router.put('/edit_product/:id', (req, res) => {
    upload(req, res, async(err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File size too large' });
            } else if (err) {
                return res.status(400).json({ message: err });
            }
            const { name, category, price } = req.body;
            const img = req.file ? '/images/' + req.file.filename : '';
            const productId = req.params.id;
            const product = await Product.findByIdAndUpdate(productId, { name, category, price, img }, { new: true });
            res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
});


/******************************************************
 * @delete_product
 * @route DELETE http://localhost:8000/user/delete_product/:id
 * @description Delete a Product
 * @returns message for delete
 ******************************************************/
router.delete('/delete_product/:id', async(req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/******************************************************
 * @get_products
 * @route GET http://localhost:8000/user/get_products
 * @description Get all products
 * @returns Object all products
 ******************************************************/
router.get('/get_products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/******************************************************
 * @add_products/:categoryId'
 * @route GET http://localhost:8000/user/get_product/:categoryId
 * @description Get a product by Categoty
 * @returns Object a Product
 ******************************************************/
router.get('/get_products/:categoryId', async(req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.find({ category: categoryId });
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;