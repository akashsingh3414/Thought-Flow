import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [charCount, setCharCount] = useState(200);

    const handleChange = (e) => {
        setComment(e.target.value);
        setCharCount(200 - e.target.value.length);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setComment('');
        setCharCount(200);
    };

    return (
        <div className="max-w-2xl mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
            {currentUser ? (
                <div className="flex items-center mb-4 text-gray-700">
                    <img
                        src={currentUser.user.profilePhoto}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover mr-2"
                    />
                    <span className="font-semibold">
                        Signed in as:
                        <Link 
                            to={`/profile?userName=${currentUser.user.userName}`} 
                            className="text-blue-600 hover:text-blue-800 ml-1 hover:underline transition duration-200"
                        >
                           @{currentUser.user.userName}
                        </Link>
                    </span>
                </div>
            ) : (
                <div className="text-md text-gray-500 my-5">
                    You must be signed in to comment.{' '}
                    <Link
                        to="/signin"
                        className="m-2 bg-blue-500 px-2 py-1 rounded-lg text-white font-semibold hover:bg-blue-600"
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {currentUser && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <textarea
                        placeholder="Leave your thoughts"
                        maxLength="200"
                        value={comment}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring focus:ring-blue-300"
                        rows="4"
                    />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{charCount} Characters Remaining</span>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default CommentSection;