import React, { useEffect, useState } from 'react';
 
const CompanyInfo = () => {
  const [info, setInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
 const [logoFile, setLogoFile] = useState(null);
  useEffect(() => {
fetch('http://localhost:3005/companyInfo')
      .then(res => res.json())
      .then(data => {
        setInfo(data.data);
        setFormData(data.data);
        setLoading(false);
      });
  }, []);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
 const handleUpdate = async () => {
  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => form.append(key, value));
  if (logoFile) form.append('logo', logoFile);
 
const res = await fetch(`http://localhost:3005/companyInfo/${info._id}`, {
    method: 'PUT',
    body: form,
  });
 
  const data = await res.json();
  setInfo(data.data);
  setFormData(data.data);
  setLogoFile(null);
  setEditMode(false);
};
 
  if (loading) return <div>Loading...</div>;
 
  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Company Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-6">
  <label className="block text-sm font-medium text-gray-700">Company Logo</label>
  {info.logo && (
    <img
src={info.logo}
      alt="Company Logo"
      className="h-24 w-auto my-2"
    />
  )}
  {editMode && (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setLogoFile(e.target.files[0])}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
    />
  )}
</div>
        {[
          { label: 'Email', key: 'Email' },
          { label: 'Phone', key: 'Phone_No' },
          { label: 'Address', key: 'Address' },
          { label: 'Facebook', key: 'facebook' },
          { label: 'Instagram', key: 'Instagram' },
          { label: 'Twitter', key: 'twitter' },
          { label: 'LinkedIn', key: 'linkedIn' },
          { label: 'HAPPY_CUSTOMER', key: 'HAPPY_CUSTOMER' },
          { label: 'Properties_in_stock', key: 'Properties_in_stock' },
          { label: 'City_registered', key: 'City_registered' },
          { label: 'DEALER_BRANCHES', key: 'DEALER_BRANCHES' },
          { label: 'geo_latituse', key: 'geo_latituse' },
          { label: 'geo_longitude', key: 'geo_longitude' }
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                !editMode ? 'bg-purple-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
        ))}
      </div>
 
      <div className="mt-6 flex space-x-4">
        {editMode ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setFormData(info);
                setEditMode(false);
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-400 hover:text-black"
          >
            Edit Info
          </button>
        )}
      </div>
    </div>
  );
};
 
export default CompanyInfo;