import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-200 text-black h-16 shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © 2025 RealEstate Admin Panel. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:text-purple-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-purple-600">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-purple-600">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;