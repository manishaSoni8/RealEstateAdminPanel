const mongoose = require('mongoose');
const Blog = require('../models/blog');
const BlogComment = require('../models/blogComment');

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
