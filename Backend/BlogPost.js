const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true, // Removes whitespace from both ends of a string
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: function(value) {
        return typeof value === 'string';
      },
      message: 'Image URL must be a string'
    }
  }
}, { timestamps: true }); // Automatically creates createdAt and updatedAt fields

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
