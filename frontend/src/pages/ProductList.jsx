import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Pagination & Filtering state
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/products?keyword=${keyword}&category=${category}&pageNumber=${page}`);
                setProducts(data.products);
                setPages(data.pages);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category, page]);

    return (
        <div className="container section-padding animate-fade-in">
            <h1 className="section-title">
                {keyword ? `Search Results for "${keyword}"` : category ? `${category} Products` : 'All Products'}
            </h1>
            
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    
                    {/* Basic Pagination UI */}
                    {pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
                            {[...Array(pages).keys()].map(x => (
                                <button 
                                    key={x + 1} 
                                    onClick={() => setPage(x + 1)}
                                    className={`btn ${x + 1 === page ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {x + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;
