import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SingleCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3005/customers/${id}`);
      const data = await response.json();
      setCustomer(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!customer) return <div className="text-center py-8">Customer not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <img 
            src={customer.user.user_image || `https://ui-avatars.com/api/?name=${customer.user.First_Name}+${customer.user.Last_Name}&background=8B5CF6&color=fff`}
            alt={`${customer.user.First_Name} ${customer.user.Last_Name}`}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-purple-800">
              {`${customer.user.First_Name} ${customer.user.Last_Name}`}
            </h1>
            <p className="text-gray-600">{customer.user.Email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">First Name:</span> {customer.user.First_Name}</p>
              <p><span className="font-semibold">Last Name:</span> {customer.user.Last_Name}</p>
              <p><span className="font-semibold">Email:</span> {customer.user.Email}</p>
              <p><span className="font-semibold">Phone:</span> {customer.user.Phone || 'N/A'}</p>
              <p><span className="font-semibold">Address:</span> {customer.user.Address || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Purchase Summary</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">Total Properties:</span> {customer.totalPurchases}</p>
              <p><span className="font-semibold">Total Spent:</span> ${customer.totalSpent?.toLocaleString()}</p>
              <p><span className="font-semibold">Join Date:</span> {new Date(customer.user.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold">Last Updated:</span> {new Date(customer.user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Purchased Properties</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.purchasedProperties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {property.propertyId.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {property.propertyId.categoryId?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {property.propertyId.cityId?.name}, {property.propertyId.stateId?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${property.amount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/properties/${property.propertyId._id}`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-900"
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCustomer;