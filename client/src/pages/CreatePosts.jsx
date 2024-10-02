import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

function CreatePosts() {
  const selectionOptions = ['Uncategorized', 'Programming Languages', 'Python', 'Web', 'App'];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentUser = useSelector((state) => state.user.currentUser);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content || !category || imageFiles.length === 0) {
      setErrorMessage('All fields are required, including images.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('userId', currentUser.user._id);

      Array.from(imageFiles).forEach((file) => {
        formData.append('files', file);
      });

      const res = await axios.post('/api/v1/user/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage(res.data.message);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 min-h-screen rounded-lg mx-auto max-w-2xl" style={{ backgroundColor: '#F5F7F8' }}>
      <h1 className="text-center font-semibold text-3xl m-6 text-gray-800">Create Your Post</h1>
      <form className="flex flex-col gap-6 p-8 rounded-lg shadow-lg bg-white text-black" onSubmit={handlePost}>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col flex-grow">
            <label htmlFor="title" className="mb-2 text-sm font-semibold text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter the title here..."
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col flex-grow">
            <label htmlFor="category" className="mb-2 text-sm font-semibold text-gray-700">Category</label>
            <select
              id="category"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {selectionOptions.map((opt, index) => (
                <option key={index} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="files" className="mb-2 text-sm font-semibold text-gray-700">Upload Files</label>
          <input
            type="file"
            id="files"
            accept="image/*"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Upload Files"
            multiple
            onChange={(e) => setImageFiles(e.target.files)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-700">Content</label>
          <ReactQuill
            theme="snow"
            placeholder="Flow into your thoughts here..."
            className="h-36 mb-6 rounded"
            onChange={(value) => setContent(value)}
          />
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button
          type="submit"
          className="mt-6 p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePosts;
