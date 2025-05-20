import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchBlog();
  }, [id]);

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
      <h1 className="text-4xl font-bold text-purple-800 mb-4">{blog.Title}</h1>
      <p className="text-sm text-gray-500 mb-6">By {blog.Auther} | {new Date(blog.Date).toLocaleDateString()}</p>
      
      <img
        src={blog.Img}
        alt={blog.Title}
        className="w-full max-h-[400px] object-cover rounded-xl mb-6"
      />
      
      <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
        {blog.Description}
      </p>

      <hr className="my-10" />

      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="flex items-center space-x-4 mb-2">
                <img
                  src={`http://localhost:3005/uploads/${comment.Img}`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <strong>{comment.name}</strong>
              </div>
              <p className="text-gray-700">{comment.Comment}</p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(comment.Date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleBlog;
