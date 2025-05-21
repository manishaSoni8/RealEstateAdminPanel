import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 2;

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:3005/blogs'); // fetch all blogs at once
      const data = await response.json();
      setBlogs(data.blogs || data); // adapt to your API response shape
      setFilteredBlogs(data.blogs || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const keyword = search.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.Title.toLowerCase().includes(keyword) ||
        blog.Description.toLowerCase().includes(keyword) ||
        (blog.Auther && blog.Auther.toLowerCase().includes(keyword))
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1); // reset to first page on search change
  };

  // Pagination slicing
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800">Blog Posts</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/blogs/create"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Blog
          </Link>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {currentBlogs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No blogs found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Blog;
