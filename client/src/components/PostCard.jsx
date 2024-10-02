import React from 'react';
import DOMPurify from 'dompurify';

function PostCard({ post }) {
    const cleanContent = DOMPurify.sanitize(post.content);

    return (
        <div className="max-w-md w-full min-h-[300px] rounded-lg overflow-hidden shadow-lg bg-white hover:bg-blue-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
            {post.image && (
                <img className="w-full h-48 object-cover" src={post.image} alt={post.title} />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>

                <div 
                    className="text-gray-600 text-sm mt-2 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: cleanContent.length > 100 ? cleanContent.substring(0, 100) + '...' : cleanContent }}></div>
            </div>
            <div className="px-4 pb-4 flex justify-between items-center">
                <span className="text-gray-500 text-sm">By {post.authorName || "Anonymous"}</span>
                <button className="text-blue-500 hover:underline">Read More</button>
            </div>
        </div>
    );
}

export default PostCard;
