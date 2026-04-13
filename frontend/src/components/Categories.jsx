import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ categoryName: '' });
    const [editingId, setEditingId] = useState(null);

    // Fetch categories when the component loads
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    // Handle form input
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Add or Edit submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/categories/${editingId}`, formData);
                alert("Category Updated!");
            } else {
                await axios.post('http://localhost:5000/api/categories', formData);
                alert("Category Added!");
            }
            
            setFormData({ categoryName: '' });
            setEditingId(null);
            fetchCategories(); 
        } catch (error) {
            console.error("Error saving category", error);
        }
    };

    const handleEditClick = (category) => {
        setEditingId(category.categoryid);
        setFormData({ 
            categoryName: category.categoryname 
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("WARNING: Are you sure you want to delete this category? This will also delete ALL products inside this category!")) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${id}`);
                alert("Category Deleted!");
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category", error);
            }
        }
    };

    const inputStyle = {
        marginRight: '10px',
        padding: '10px',
        border: '1px solid #ced4da',
        borderRadius: '6px',
        backgroundColor: '#fdfdfd',
        color: '#495057',
        fontSize: '14px',
        outline: 'none'
    };

    const btnStyle = {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'background-color 0.2s'
    };

    return (
        <div style={{marginTop: '6rem', backgroundColor: '#f4f7f6', color: '#333', minHeight: '100vh', width: '100%', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Category Management</h2>

            <div style={{ 
                marginBottom: '30px', 
                padding: '25px', 
                backgroundColor: '#ffffff', 
                border: '1px solid #e9ecef', 
                borderRadius: '10px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
            }}>
                <h3 style={{ marginTop: '0', color: '#495057', fontSize: '18px' }}>
                    {editingId ? "✏️ Edit Category" : "Add New Category"}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <input 
                        type="text" 
                        name="categoryName" 
                        placeholder="Category Name" 
                        value={formData.categoryName} 
                        onChange={handleInputChange} 
                        required 
                        style={inputStyle}
                    />
                    <button type="submit" style={{ ...btnStyle, backgroundColor: 'black', color: 'white' }}>
                        {editingId ? "Update Category" : "Save Category"}
                    </button>
                    {editingId && (
                        <button 
                            type="button" 
                            onClick={() => { setEditingId(null); setFormData({ categoryName: '' }) }}
                            style={{ ...btnStyle, backgroundColor: '#e9ecef', color: '#495057' }}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* Table Card */}
            <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '10px', 
                border: '1px solid #e9ecef',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', color: '#495057', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '15px' }}>Category ID</th>
                            <th style={{ padding: '15px' }}>Category Name</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c, index) => (
                            <tr key={c.categoryid || index} style={{ borderBottom: '1px solid #e9ecef' }}>
                                <td style={{ padding: '15px', color: '#6c757d' }}>{c.categoryid}</td>
                                <td style={{ padding: '15px', fontWeight: '500' }}>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '15px', 
                                        fontWeight: 'bold' 
                                    }}>
                                        {c.categoryname}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button 
                                        onClick={() => handleEditClick(c)} 
                                        style={{ ...btnStyle, backgroundColor: 'black', color: 'white', marginRight: '8px' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(c.categoryid)} 
                                        style={{ ...btnStyle, backgroundColor: '#e33f50', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;