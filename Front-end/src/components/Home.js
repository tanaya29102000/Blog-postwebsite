// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './Home.css'; // Ensure this CSS file exists and is updated
// import swal from 'sweetalert'; // Import SweetAlert


// const Home = () => {
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // Added loading state

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('https://blog-postwebsite.vercel.app/api/posts');
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//         setError('Failed to fetch posts. Please try again later.');
//       } finally {
//         setLoading(false); // Set loading to false after fetching
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmed = await swal({
//       title: "Are you sure?",
//       text: "Once deleted, you will not be able to recover this post!",
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//     });
    
//     try {
//       const response = await axios.delete(`https://blog-postwebsite.vercel.app/api/posts/${id}`);
//       console.log(response.data); // Log response to ensure delete is working
//       setPosts(posts.filter(post => post._id !== id));
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       setError('Failed to delete post. Please try again later.');
//     }
//   };
  

//   if (loading) {
//     return <p>Loading posts...</p>; // Show loading message
//   }

//   return (
//     <div className="home">
//       <h3 className="PostTitle">All Posts</h3>
//       {error && <p className="error-message">{error}</p>}
//       <ul className="post-list">
//         {posts.map(post => (
//           <li key={post._id} className="post-item">
//             <div className="post-content">
//               <h5>Title: {post.title}</h5>
//               <p>Content: {post.content}</p>
//               <p>By: {post.author}</p>
//               <p>At: {new Date(post.createdAt).toLocaleString()}</p>
//               {post.image && <img src={post.image} alt={post.title} style={{ width: '100px', marginTop: '10px' }} />} {/* Display image if available */}
//             </div>
//             <div className="post-actions">
//               <Link to={`/update-post/${post._id}`} className="edit-btn">Edit</Link>
//               <button onClick={() => handleDelete(post._id)} className="delete-btn">Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert'; // Import SweetAlert
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blog-postwebsite.vercel.app/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        axios.delete(`https://blog-postwebsite.vercel.app/api/posts/${id}`)
          .then(() => {
            setPosts(posts.filter(post => post._id !== id));
            swal("Deleted!", "Your post has been deleted.", "success");
          })
          .catch((error) => {
            console.error('Error deleting post:', error);
            swal("Failed", "Failed to delete post. Please try again later.", "error");
          });
      }
    });
  };

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="home">
      <h3 className="post-title">All Posts</h3>
      {error && <p className="error-message">{error}</p>}
      <ul className="post-list">
        {currentPosts.map(post => (
          <li key={post._id} className="post-item">
            <div className="post-content">
              <h5>Title: {post.title}</h5>
              <p>Content: {post.content}</p>
              <p>By: {post.author}</p>
            </div>
            {post.image && (
              <div className="image-container">
                <img 
                  src={post.image} 
                  alt={post.title} 
                />
              </div>
            )}
            <div className="post-actions">
              <Link to={`/update-post/${post._id}`} className="edit-btn">Edit</Link>
              <button onClick={() => handleDelete(post._id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination 
        postsPerPage={postsPerPage} 
        totalPosts={posts.length} 
        paginate={paginate} 
        currentPage={currentPage}
      />
    </div>
  );
};

// Pagination Component
const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Home;
