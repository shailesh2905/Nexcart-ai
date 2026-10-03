import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Trash2, Edit, Plus, Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    
    // State for Products
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAdminProducts = async () => {
        setLoading(true);
        try {
            // We use the same endpoint but a huge page size just for admin view, or a dedicated admin endpoint. 
            // For simplicity, we'll fetch all.
            const { data } = await axios.get('/api/products?pageNumber=1&keyword=');
            setProducts(data.products);
            setLoading(false);
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'products') {
            fetchAdminProducts();
        }
    }, [activeTab]);

    const deleteProductHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                fetchAdminProducts(); // Refresh the list
            } catch (err) {
                alert(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    return (
        <div className="container section-padding animate-fade-in">
            <h1 className="section-title">Admin Dashboard</h1>

            <div className="admin-layout">
                {/* Sidebar */}
                <div className="admin-sidebar glass">
                    <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <TrendingUp size={18} /> Overview
                    </button>
                    <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <Package size={18} /> Products
                    </button>
                    <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <DollarSign size={18} /> Orders
                    </button>
                    <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={18} /> Users
                    </button>
                </div>

                {/* Main Content */}
                <div className="admin-content glass">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Store Overview</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <div className="stat-value">$12,450.00</div>
                                        <div className="stat-label">Total Revenue</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="stat-value">142</div>
                                        <div className="stat-label">Total Orders</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <div className="stat-value">89</div>
                                        <div className="stat-label">Registered Users</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: '#1e293b' }}>Manage Products</h2>
                                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus size={18} /> Create Product
                                </button>
                            </div>

                            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>NAME</th>
                                                <th>PRICE</th>
                                                <th>CATEGORY</th>
                                                <th>BRAND</th>
                                                <th>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td style={{ fontWeight: '500' }}>{product.name}</td>
                                                    <td>${product.price}</td>
                                                    <td>{product.category_name}</td>
                                                    <td>{product.brand}</td>
                                                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="icon-btn edit"><Edit size={16} /></button>
                                                        <button className="icon-btn delete" onClick={() => deleteProductHandler(product.id)}><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {(activeTab === 'orders' || activeTab === 'users') && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                            <p>This section is under construction for Phase 2.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
