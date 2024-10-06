import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'

function PostPage() {
    const { postSlug } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ error, setError, ] = useState(null);
    const [ post, setPost ] = useState(null);

    const fetchPost = async (postSlug) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/post/getPosts?slug=${postSlug}`)
            if(res.status === 200) {
                setPost(res.data.posts[0]);
                setError(null)
                setLoading(false)
            } else {
                setError(res.data?.message)
                setLoading(false);
            }
        } catch (error) {
            setError(error.response?.data?.message)
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(postSlug) {
            fetchPost(postSlug);
        }
    },[postSlug])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color={"blue"} loading={loading} size={50} />
            </div>
        );
    }
    


  return (
    <main className='p-3 flex flex-col items-center max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 text-center font-serif w-full mx-auto lg:text-4xl'>
        {post && post.title}
    </h1>
    <Link to={`/api/v1/post/search?category=${post && post.category}`}>
        <button className='rounded-lg text-blue-500 text-center mt-4'>
            {post && post.category}
        </button>
    </Link>
    <img src={post && post.images[0]} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-contain'/>
    <div className='flex justify-between gap-2 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length/1000).toFixed(0)} mins read</span>
    </div>
    <div className='p-3 w-full mx-auto post-content' dangerouslySetInnerHTML={{__html:post && post.content}}></div>
</main>

  )
}

export default PostPage