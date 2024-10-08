import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="flex flex-col w-full max-w-sm h-72 gap-2 p-2 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-2xl transition-shadow duration-300">
      {post.images && post.images.length > 0 && (
        <div className='flex-1 rounded-t-lg overflow-hidden'>
          <img 
            className={`h-full w-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105`} 
            src={post.images[0]} 
            alt={post.title} 
          />
        </div>
      )}
      <div className='flex-none rounded-lg'>
        <h5 className="text-lg font-bold text-gray-800">
          {post.title || 'Card Title'}
        </h5>
      </div>
    </div>
  );
};

export default PostCard;
