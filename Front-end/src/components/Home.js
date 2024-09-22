import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure this CSS file exists and is updated

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/posts/${id}`);
      console.log(response.data); // Log response to ensure delete is working
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again later.');
    }
  };
  

  if (loading) {
    return <p>Loading posts...</p>; // Show loading message
  }

  return (
    <div className="home">
      <h3 className="PostTitle">All Posts</h3>
      {error && <p className="error-message">{error}</p>}
      <ul className="post-list">
        {posts.map(post => (
          <li key={post._id} className="post-item">
            <div className="post-content">
              <h5>Title: {post.title}</h5>
              <p>Content: {post.content}</p>
              <p>By: {post.author}</p>
              <p>At: {new Date(post.createdAt).toLocaleString()}</p>
              {post.image && <img src={post.image} alt={post.title} style={{ width: '100px', marginTop: '10px' }} />} {/* Display image if available */}
            </div>
            <div className="post-actions">
              <Link to={`/update-post/${post._id}`} className="edit-btn">Edit</Link>
              <button onClick={() => handleDelete(post._id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;