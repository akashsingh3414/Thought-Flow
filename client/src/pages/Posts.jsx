import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Posts() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'none',
  });

  const [categories, setCategories] = useState([]);
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

    fetchPosts(searchTermFromUrl, sortFromUrl, categoryFromUrl);
  }, [location.search]);

  const fetchPosts = async (searchTerm, sort, category) => {
    try {
      setLoading(true);
      const searchQuery = new URLSearchParams({
        searchTerm: searchTerm || '',
        sort: sort || 'desc',
        category: category || 'none',
      }).toString();

      const res = await axios.get(`/api/v1/post/getposts?${searchQuery}`);
      setPosts(res.data.posts);

      const uniqueCategories = Array.from(
        new Set(res.data.posts.map((post) => post.category))
      ).map((cat) => ({ id: cat, value: cat, label: cat }));

      setCategories(uniqueCategories);
      setLoading(false);
      setShowMore(res.data.posts.length === 10);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

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
    navigate(`/posts?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    try {
      const numberOfPosts = posts.length;
      const urlParams = new URLSearchParams({
        searchTerm: sidebarData.searchTerm || '',
        sort: sidebarData.sort || 'desc',
        category: sidebarData.category || 'none',
        startIndex: numberOfPosts.toString(),
      });

      const res = await axios.get(`/api/v1/post/getposts?${urlParams.toString()}`);
      setPosts([...posts, ...res.data.posts]);
      setShowMore(res.data.posts.length === 10);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Term
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search..."
                  />
                </div>

                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort
                  </label>
                  <select
                    id="sort"
                    value={sidebarData.sort}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={sidebarData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="none">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : posts.length === 0 ? (
                <p className="text-xl text-gray-500 text-center">No posts found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link key={post._id} to={`/post/${post.slug}`} className="group">
                        <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                          <img
                            src={post.images[0] || '/placeholder.svg?height=200&width=300'}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600">
                              {post.title}
                            </h3>
                            <p
                              className="text-sm text-gray-600 mb-2"
                              dangerouslySetInnerHTML={{
                                __html: post.content.substring(0, 100) + '...',
                              }}
                            />
                            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                          </div>
                        </div>
                    </Link>
                  ))}
                </div>
              )}
              {showMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
