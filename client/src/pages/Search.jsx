import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'none',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    setSidebarData((prevData) => ({
      ...prevData,
      searchTerm: searchTermFromUrl || prevData.searchTerm,
      sort: sortFromUrl || prevData.sort,
      category: categoryFromUrl || prevData.category,
    }));

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = new URLSearchParams({
          searchTerm: searchTermFromUrl || '',
          sort: sortFromUrl || 'desc',
          category: categoryFromUrl || 'none',
        }).toString();

        const res = await axios.get(`/api/v1/post/getposts?${searchQuery}`);
        setPosts(res.data.posts);
        setLoading(false);
        setShowMore(res.data.posts.length === 10);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams({
      searchTerm: sidebarData.searchTerm,
      sort: sidebarData.sort,
      category: sidebarData.category,
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    try {
      const numberOfPosts = posts.length;
      const urlParams = new URLSearchParams({
        searchTerm: sidebarData.searchTerm || '',
        sort: sidebarData.sort || 'desc',
        category: sidebarData.category || 'none',
        startIndex: numberOfPosts,
      });

      const res = await axios.get(`/api/v1/post/getposts?${urlParams.toString()}`);
      setPosts([...posts, ...res.data.posts]);
      setShowMore(res.data.posts.length === 10);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 shadow md:min-h-screen bg-gray-100">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className="rounded px-3 py-2 w-full"
              placeholder="Search..."
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort"
              value={sidebarData.sort}
              onChange={handleChange}
              className="rounded px-3 py-2 w-full"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
              className="rounded px-3 py-2 w-full"
            >
              <option value="none">None</option>
              <option value="uncategorized">Uncategorized</option>
              <option value="programming languages">Programming Languages</option>
              <option value="python">Python</option>
              <option value="web">Web</option>
              <option value="app">App</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Apply Filters
          </button>
        </form>
      </div>

      <div className="w-full">
        <h1 className="text-3xl font-semibold p-3 mt-5">
          Post Results:
        </h1>
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading && posts && posts.map((post) => <Link key={post._id} to={`/post/${post.slug}`}><PostCard post={post} /></Link>)}
        </div>

        {showMore && (
          <div className="text-center p-7">
            <button
              onClick={handleShowMore}
              className="text-indigo-600 text-lg hover:underline"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
