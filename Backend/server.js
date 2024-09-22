require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  image: String,
   // Store image URL
});

const Post = mongoose.model('Post', postSchema);

// API to create a post with direct image URL
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author, image } = req.body; // Accept image URL directly

    // Create a new post with the provided data
    const newPost = new Post({ title, content, author, image });
    console.log(newPost);
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Failed to add post');
  }
});

// API to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
   
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Failed to fetch posts');
  }
});

// API to get a specific post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Failed to fetch post');
  }
});

// API to update a post with a new image URL
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, author, image } = req.body; // Accept new image URL
    console.log('Received data:', { title, content, author, image });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, image },
      { new: true }
    );

    if (!updatedPost) return res.status(404).send('Post not found');
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('Failed to update post');
  }
});

// API to delete a post by ID
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).send('Post not found');
    }

    res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Failed to delete post');
  }
});



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));