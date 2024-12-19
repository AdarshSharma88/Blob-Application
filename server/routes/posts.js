const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Authorization token missing' });
  }

  const formattedToken = token.split(' ')[1];
  jwt.verify(formattedToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.id; // Attach user ID to request
    next();
  });
};

// Create a new post
router.post('/', authenticate, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newPost = new Post({ title, content, author: req.userId });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the post', details: err.message });
  }
});

// Update a post
router.put('/:id', authenticate, async (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: 'At least one field (title or content) is required to update' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post', details: err.message });
  }
});

// Delete a post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post', details: err.message });
  }
});

module.exports = router;
