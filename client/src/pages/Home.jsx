import { Link } from 'react-router-dom';
import ConnectionCard from '../components/ConnectionCard';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/v1/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-800'>
      <div className='flex flex-col gap-4 p-6 lg:p-16 px-4 max-w-6xl mx-auto'>
        <h1 className='text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white text-center'>
          Welcome:) to <span className='text-indigo-700'>Thought Flow</span>
        </h1>
        <p className='text-gray-600 dark:text-gray-400 text-md sm:text-lg text-center'>
          Let your thoughts flow. Express them freely!
        </p>
        <Link
          to='/search'
          className='text-sm lg:text-md text-teal-500 font-bold hover:underline self-center'
        >
          View all posts
        </Link>
      </div>

      <div className='p-4 lg:p-8 bg-amber-100 dark:bg-slate-700'>
        <ConnectionCard />
      </div>

      <div className='max-w-6xl mx-auto p-4 lg:p-8'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h2 className='text-3xl font-semibold text-center text-gray-800 dark:text-white'>
              Recent Posts
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {posts.map((post) => (
                <Link key={post._id} to={`/post/${post.slug}`}><PostCard post={post} /></Link>
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
