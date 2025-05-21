import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="relative pt-[60%]"> {/* 60% aspect ratio container */}
        <img
          src={`http://localhost:3005/uploads/${blog.Img}`}
          alt={blog.Title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-blog.jpg';
            e.target.onerror = null;
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-purple-800 mb-2 line-clamp-2">{blog.Title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{blog.Description}</p>
        <div className="flex justify-between items-center mt-auto">
          <div className="text-sm text-gray-500">
            <p>By {blog.Auther}</p>
            <p>{new Date(blog.Date).toLocaleDateString()}</p>
          </div>
          <Link
            to={`/blogs/${blog._id}`}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;