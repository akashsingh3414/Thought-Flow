import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePosts() {
  return (
    <div className='px-4 min-h-screen mx-auto max-w-2xl'>
      <h1 className='text-center font-semibold text-2xl my-4'>Create a Post</h1>
      <form className='flex flex-col gap-4 p-6 bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-800 dark:text-white'>
        
        <div className='flex flex-row gap-4'>
          <div className='flex flex-col flex-grow w-full'>
            <label htmlFor="title" className='mb-2 text-sm font-medium'>Title</label>
            <input 
              id="title" 
              type="text"
              placeholder='Enter the title here...' 
              className='p-3 border border-gray-300 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-label="Title"
            />
          </div>

          <div className='flex flex-col flex-grow'>
            <label htmlFor="category" className='mb-2 text-sm font-medium'>Category</label>
            <select 
              id="category" 
              className='p-3 border border-gray-300 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-label="Category"
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
          <label htmlFor="files" className='mb-2 text-sm font-medium'>Upload Files</label>
          <input 
            type='file'
            id="files" 
            accept='image/*'
            className='p-3 border border-gray-300 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label="Upload Files"
          />
        </div>

        <div className='flex flex-col text-black dark:text-white'>
          <label htmlFor="content" className='mb-2 text-sm font-medium'>Content</label>
          <ReactQuill 
            theme="snow" 
            placeholder='Flow into your thoughts here...' 
            className='h-72 mb-6 dark:bg-gray-700 dark:text-white rounded' 
          />
        </div>

        <button 
          type="submit" 
          className='mt-6 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 shadow-md'
        >
          Create Post
        </button>
        
      </form>
    </div>
  );
}

export default CreatePosts;
