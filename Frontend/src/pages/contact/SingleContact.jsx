import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleContact = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDetails();
   
  }, [id]);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch(`https://realestateadminpanel-2.onrender.com/contactforms/${id}`);
      const data = await response.json();
      setContact(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      setLoading(false);
    }
  };
  
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!contact) return <div className="text-center py-8">Agent not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <img 
            src={contact.user_image || `https://ui-avatars.com/api/?name=${contact.First_Name}+${contact.Last_Name}&background=8B5CF6&color=fff`}
            alt={`${contact.First_Name} ${contact.Last_Name}`}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-purple-800">{`${contact.First_Name} ${contact.Last_Name}`}</h1>
            <p className="text-gray-600">{contact.Email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Personal Information</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">First Name:</span> {contact.First_Name}</p>
              <p><span className="font-semibold">Last Name:</span> {contact.Last_Name}</p>
              <p><span className="font-semibold">Email:</span> {contact.Email}</p>
              
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Subject</h3>
            <div className="space-y-3">
            
              
              <p>{contact.Subject}</p>
            </div>
          </div>

         

              <div className="bg-purple-50 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold text-purple-800">Message </h3>
        
           <p className="text-sm ">{contact.Message}</p>
            </div>
            </div> 
          </div>
        </div>
     
  
  );
};

export default SingleContact;