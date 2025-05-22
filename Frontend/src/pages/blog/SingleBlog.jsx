import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogCommentForm from '../../components/forms/BlogCommentForm';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add current admin check
  const currentAdmin = JSON.parse(localStorage.getItem('user'));

  // Add delete handler
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        navigate('/blogs');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:3005/blogs/${id}`);
      const data = await response.json();
      setBlog(data.blog);
      setComments(data.comments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Header with Admin Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-purple-800">{blog.Title}</h1>
          
          {/* Show admin controls for any admin */}
          {currentAdmin && (
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/blogs/${id}/edit`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Blog
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Blog
              </button>
            </div>
          )}
        </div>

        {/* Rest of the blog header content */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            By {blog.Auther} | {new Date(blog.Date).toLocaleDateString()}
          </p>
          <div className="flex items-center text-purple-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
            </svg>
            <span>{comments.length} Comments</span>
          </div>
        </div>
        
        <img
          src={`http://localhost:3005/uploads/${blog.Img}`}
          alt={blog.Title}
          className="w-full max-h-[500px] object-cover rounded-xl mb-6"
          onError={(e) => {
            e.target.src = '/default-blog.jpg';
          }}
        />
        
        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {blog.Description}
        </p>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-purple-700">Comments</h2>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Be the first to comment!</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li key={comment._id} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={`http://localhost:3005/uploads/${comment.Img}`}
                    alt={comment.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    onError={(e) => {
                      e.target.src = '/default-avatar.jpg';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-purple-900">{comment.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.Date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="pl-16">
                  <p className="text-gray-700 leading-relaxed">{comment.Comment}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
         {/* Comment Form */}
        <div className="mb-8">
          <BlogCommentForm blogId={id} onCommentAdded={handleCommentAdded} />
        </div>

      </div>
    </div>
  );
};

export default SingleBlog;
