import { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;
    const [formData, setFormData] = useState({ productName: '', categoryId: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async (currentPage) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products?page=${currentPage}&pageSize=${pageSize}`);
            setProducts(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/products/${editingId}`, formData);
                alert("Product Updated!");
            } else {
                await axios.post(`http://localhost:5000/api/products`, formData);
                alert("Product Added!");
            }

            setFormData({ productName: '', categoryId: '' });
            setEditingId(null);
            fetchProducts(page);
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product.productid);
        setFormData({
            productName: product.productname,
            categoryId: product.categoryid
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                alert("Product Deleted!");
                fetchProducts(page);
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    const handlePrev = () => { if (page > 1) setPage(page - 1); };
    const handleNext = () => { if (page < totalPages) setPage(page + 1); };

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
        <div style={{marginTop: '6rem', backgroundColor: '#f4f7f6', color: '#333', minHeight: '100vh', width: '100%', boxSizing: 'border-box', padding: '30px', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Product Management</h2>

            <div style={{ 
                marginBottom: '30px', 
                padding: '25px', 
                backgroundColor: '#ffffff', 
                border: '1px solid #e9ecef', 
                borderRadius: '10px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
            }}>
                <h3 style={{ marginTop: '0', color: '#495057', fontSize: '18px' }}>
                    {editingId ? "✏️ Edit Product" : "Add New Product"}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <input
                        type="text"
                        name="productName"
                        placeholder="Product Name"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />
                    
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="" disabled>Select a Category</option>
                        {categories.map((c) => (
                            <option key={c.categoryid} value={c.categoryid}>
                                {c.categoryname}
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={{ ...btnStyle, backgroundColor: 'black', color: 'white' }}>
                        {editingId ? "Update Product" : "Save Product"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ productName: '', categoryId: '' }) }} style={{ ...btnStyle, backgroundColor: '#e9ecef', color: '#495057' }}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

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
                            <th style={{ padding: '15px' }}>Product ID</th>
                            <th style={{ padding: '15px' }}>Product Name</th>
                            <th style={{ padding: '15px' }}>Category ID</th>
                            <th style={{ padding: '15px' }}>Category Name</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.productid} style={{ borderBottom: '1px solid #e9ecef' }}>
                                <td style={{ padding: '15px', color: '#6c757d' }}>{p.productid}</td>
                                <td style={{ padding: '15px', fontWeight: '500' }}>{p.productname}</td>
                                <td style={{ padding: '15px' }}>{p.categoryid}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '15px', 
                                        fontWeight: 'bold' 
                                    }}>
                                        {p.categoryname}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button 
                                        onClick={() => handleEditClick(p)} 
                                        style={{ ...btnStyle, backgroundColor: 'black', color: 'white', marginRight: '8px' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(p.productid)}
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

            <div style={{ marginTop: '25px', display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <button 
                    onClick={handlePrev} 
                    disabled={page === 1}
                    style={{ ...btnStyle, backgroundColor: page === 1 ? '#e9ecef' : '#ffffff', border: '1px solid #ced4da', color: page === 1 ? '#adb5bd' : '#495057' }}
                >
                    Previous
                </button>
                <span style={{ fontWeight: '500', color: '#495057' }}>
                    Page {page} of {totalPages}
                </span>
                <button 
                    onClick={handleNext} 
                    disabled={page === totalPages || totalPages === 0}
                    style={{ ...btnStyle, backgroundColor: page === totalPages || totalPages === 0 ? '#e9ecef' : '#ffffff', border: '1px solid #ced4da', color: (page === totalPages || totalPages === 0) ? '#adb5bd' : '#495057' }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Products;