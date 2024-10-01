import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePosts() {
  return (
    <div className='p-4 min-h-screen rounded-lg mx-auto max-w-2xl' style={{ backgroundColor: '#F5F7F8' }}>
      <h1 className='text-center font-semibold text-3xl m-6 text-gray-800'>Create Your Post</h1>
      <form className='flex flex-col gap-6 p-8 rounded-lg shadow-lg bg-white text-black'>
        
        <div className='flex flex-row gap-4'>
          <div className='flex flex-col flex-grow'>
            <label htmlFor="title" className='mb-2 text-sm font-semibold text-gray-700'>Title</label>
            <input 
              id="title" 
              type="text"
              placeholder='Enter the title here...' 
              className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
              aria-label="Title"
              required
            />
          </div>

          <div className='flex flex-col flex-grow'>
            <label htmlFor="category" className='mb-2 text-sm font-semibold text-gray-700'>Category</label>
            <select 
              id="category" 
              className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
              aria-label="Category"
              required
            >
              <option value="">Select a Category</option>
              <option value="uncategorized">Uncategorized</option>
              <option value="programming">Programming Languages</option>
              <option value="web-dev">Web Development</option>
              <option value="software-dev">Software Development</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="ml">Machine Learning</option>
              <option value="data-science">Data Science</option>
              <option value="deep-learning">Deep Learning</option>
              <option value="data-analysis">Data Analysis</option>
            </select>
          </div>
        </div>

        <div className='flex flex-col'>
          <label htmlFor="files" className='mb-2 text-sm font-semibold text-gray-700'>Upload Files</label>
          <input 
            type='file'
            id="files" 
            accept='image/*'
            className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
            aria-label="Upload Files"
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor="content" className='mb-2 text-sm font-semibold text-gray-700'>Content</label>
          <ReactQuill 
            theme="snow" 
            placeholder='Flow into your thoughts here...' 
            className='h-36 mb-6 rounded' 
          />
        </div>

        <button 
          type="submit" 
          className='mt-6 p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 shadow-md'
        >
          Create Post
        </button>
        
      </form>
    </div>
  );
}

export default CreatePosts;