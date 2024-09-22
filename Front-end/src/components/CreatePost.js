import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./CreatePost.css";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    author: Yup.string().required("Author is required"),
    image: Yup.mixed()
      .required("An image file is required")
      .test(
        "fileType",
        "Only PNG, JPG, and JPEG files are allowed",
        (value) => {
          return (
            value &&
            ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
          );
        }
      )
      .test("fileSize", "File size must be less than 6 MB", (value) => {
        return value && value.size <= 6 * 1024 * 1024; // 6 MB in bytes
      }),
  });


    const handleImageUpload = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'images1'); // Replace with your preset
    
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/der0czjyu/image/upload',
        formData
      );
    
      return uploadResponse.data.secure_url;
    };
    

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);
    try {
      let imageUrl = await handleImageUpload(values.image);
      const postData = {
        title: values.title,
        content: values.content,
        author: values.author,
        image: imageUrl,
      };

      await axios.post("https://blog-postwebsite.vercel.app/api/posts", postData);
      console.log(postData); // Redirect after 2 seconds
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.error("Failed to add post:", error);
      setFieldError("image", "Failed to upload image. Please try again."); // Set form error
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="blog-post-form">
      <h3 className="header">Add New Post</h3>
      <Formik
        initialValues={{ title: "", content: "", author: "", image: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage
                name="title"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <Field as="textarea" id="content" name="content" />
              <ErrorMessage
                name="content"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <Field type="text" id="author" name="author" />
              <ErrorMessage
                name="author"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                accept="image/png, image/jpeg"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage
                name="image"
                component="div"
                className="error-message"
              />
            </div>
            <button
              type="submit"
              className="button"
              disabled={isSubmitting || loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePost;