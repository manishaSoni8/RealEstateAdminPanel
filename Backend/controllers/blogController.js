const mongoose = require('mongoose');
const Blog = require('../models/blog');
const BlogComment = require('../models/blogComment');
const jwt = require('jsonwebtoken');

// Get all blogs with pagination and search
exports.getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || '';

        const searchQuery = {
            $or: [
                { Title: { $regex: search, $options: 'i' } },
                { Auther: { $regex: search, $options: 'i' } }
            ]
        };

        const total = await Blog.countDocuments(searchQuery);
        const blogs = await Blog.find(searchQuery)
            .sort({ Date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ FIXED: Renamed to match route
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comments = await BlogComment.find({ BlogId: blog._id })
            .sort({ Date: -1 });

        res.json({
            blog,
            comments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit a new comment with image
exports.addComment = async (req, res) => {
    try {
        const { name, BlogId, Comment } = req.body;
        const Img = req.file ? req.file.filename : 'default.jpg';

        const newComment = new BlogComment({
            name,
            BlogId,
            Comment,
            Img,
            Date: new Date()
        });

        const savedComment = await newComment.save();

        if (req.io) {
            req.io.emit('newComment', savedComment);
        }

        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add delete blog functionality with admin verification
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const adminId = req.admin._id; // Get current admin's ID

        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the current admin is the creator of the blog
        if (blog.adminId.toString() !== adminId.toString()) {
            return res.status(403).json({ 
                message: 'Unauthorized: You can only delete your own blogs' 
            });
        }

        // Delete associated comments first
        await BlogComment.deleteMany({ BlogId: blogId });
        
        // Delete the blog
        await Blog.findByIdAndDelete(blogId);

        res.json({ message: 'Blog and associated comments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add admin verification middleware
// Update the verifyAdmin middleware
exports.verifyAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret',);
        
        // Add admin data to request object from decoded token
        req.admin = {
            _id: decoded.adminId,
            email: decoded.email
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Update createBlog to use token data
exports.createBlog = async (req, res) => {
    try {
        const { Auther, Title, Description } = req.body;
        const adminId = req.admin._id; // Now using the ID from verified token
        const Img = req.file ? req.file.filename : null;

        if (!Auther || !Title || !Description || !Img) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newBlog = new Blog({
            Auther,
            Title,
            Description,
            Img,
            adminId,
            Date: new Date()
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit blog with admin verification
exports.editBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const adminId = req.admin._id;
        const { Auther, Title, Description } = req.body;
        const Img = req.file ? req.file.filename : undefined;

        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Verify if the admin owns this blog
        if (blog.adminId.toString() !== adminId.toString()) {
            return res.status(403).json({ 
                message: 'Unauthorized: You can only edit your own blogs' 
            });
        }

        const updateData = {
            Auther,
            Title,
            Description,
            ...(Img && { Img }) // Only update image if new one is provided
        };

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            updateData,
            { new: true }
        );

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
