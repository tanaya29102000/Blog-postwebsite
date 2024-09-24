
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import './UpdatePost.css';

const UpdatePost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState({
    title: '',
    content: '',
    author: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      if (id) {
        try {
          const response = await axios.get(`https://blog-postwebsite.vercel.app/api/posts/${id}`);
          const post = response.data;
          setInitialValues({
            title: post.title,
            content: post.content,
            author: post.author,
            image: null,
          });
          setImagePreview(post.image);
          setError('');
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to fetch post');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'images');

    const uploadResponse = await axios.post(
      'https://api.cloudinary.com/v1_1/dobtzmaui/image/upload',
      formData
    );
    return uploadResponse.data.secure_url;
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    author: Yup.string().required('Author is required'),
    image: Yup.mixed()
      .notRequired()
      .test('fileType', 'Only PNG, JPG, and JPEG files are allowed', value => {
        return !value || ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type);
      })
      .test('fileSize', 'File size must be less than 6 MB', value => {
        return !value || value.size <= 6 * 1024 * 1024;
      }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('author', values.author);

    try {
      let imageUrl;

      if (values.image) {
        imageUrl = await handleImageUpload(values.image);
      } else {
        imageUrl = imagePreview;
      }

      await axios.put(`https://blog-postwebsite.vercel.app/api/posts/${id}`, {
        title: values.title,
        content: values.content,
        author: values.author,
        image: imageUrl,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      // SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Post Updated',
        text: 'Your post has been updated successfully!',
        confirmButtonText: 'Go to Home',
      }).then(() => {
        navigate('/home');
      });

    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post');

      // SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update the post. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="update-post-container">
      <h1>{id ? 'Edit Post' : 'Create Post'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="update-post-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <Field as="textarea" id="content" name="content" />
              <ErrorMessage name="content" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <Field type="text" id="author" name="author" />
              <ErrorMessage name="author" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="image">Upload New Image</label>
              <input
                type="file"
                id="image"
                accept="image/png, image/jpeg"
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files[0]);
                  setImagePreview(URL.createObjectURL(event.currentTarget.files[0]));
                }}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

              <ErrorMessage name="image" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {id ? 'Update Post' : 'Create Post'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePost;
