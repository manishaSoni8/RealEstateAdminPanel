import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgentSignUpForm = () => {
    const [formData, setFormData] = useState({
        First_Name: '',
        Last_Name: '',
        Email: '',
        Password: '',
        Phone: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/agents/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (res.ok) {
                setMessage('Agent created successfully and credentials emailed.');
                setTimeout(() => navigate('/agent'), 2000);
            } else {
                setMessage(result.message || 'Failed to create agent');
            }
        } catch (error) {
            setMessage('An error occurred.');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Create New Agent</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="First_Name" value={formData.First_Name} onChange={handleChange} placeholder="First Name" required className="w-full p-2 border rounded" />
                <input name="Last_Name" value={formData.Last_Name} onChange={handleChange} placeholder="Last Name" required className="w-full p-2 border rounded" />
                <input type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
                <input type="password" name="Password" value={formData.Password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
                <input type="number" name="Phone" min="6000000000" max="9999999999"  title="Telephone must be required and contains 10 digit" value={formData.Phone} onChange={handleChange} placeholder="Contact Number" required className="w-full p-2 border rounded" />
                <button type="submit" className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700">Create Agent</button>
            </form>
        </div>
    );
};

export default AgentSignUpForm;