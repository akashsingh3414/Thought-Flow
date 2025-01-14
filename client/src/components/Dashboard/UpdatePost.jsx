import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UpdatePost() {
    const { postSlug } = useParams();
    const selectionOptions = ['Uncategorized', 'Programming Languages', 'Python', 'Web', 'App'];
    const [title, setTitle] = useState('');
    const [postOwnerId, setPostOwnerId] = useState('');
    const [postId, setPostId] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [imageFiles, setImageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/v1/post/getPosts?postSlug=${postSlug}`);
                if (res.status === 200) {
                    const post = res.data.posts[0];
                    setTitle(post.title);
                    setContent(post.content);
                    setCategory(post.category);
                    setPostOwnerId(post.userId);
                    setPostId(post._id);
                }
            } catch (error) {
                setErrorMessage('Failed to fetch the post data.');
            }
        };

        fetchPost();
    }, [postSlug]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!title || !content || !category) {
            setErrorMessage('All fields are required.');
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
            formData.append('postOwnerId', postOwnerId);
            formData.append('postId', postId);
    
            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('files', imageFiles[i]);
                }
            }
    
            const res = await axios.patch(`/api/v1/post/updatePost`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if(res.status === 401 ) {
                dispatch(logoutStart())
            }
    
            setSuccessMessage(res.data.message);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="flex flex-col h-full p-4 rounded-lg mx-auto w-full">
            <h1 className="text-center font-semibold text-3xl m-6 text-gray-800">Edit Your Post</h1>
            <form className="flex flex-col gap-6 p-8 rounded-lg shadow-lg bg-white text-black flex-grow" onSubmit={handlePost}>
                <div className="flex flex-col md:flex-row gap-4">
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
                        className="h-36 mb-6 rounded min-h-96"
                        value={content}
                        onChange={(value) => setContent(value)}
                    />
                </div>

                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                <button
                    type="submit"
                    className="mt-6 p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 shadow-md"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Update Post'}
                </button>
            </form>
        </div>
    );
}

export default UpdatePost;
