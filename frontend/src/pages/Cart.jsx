import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotalPrice } = useContext(CartContext);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="container section-padding animate-fade-in">
            <h1 className="section-title">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
                    <h2 style={{ marginBottom: '1rem', color: '#4a4a68' }}>Your cart is empty</h2>
                    <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Cart Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cartItems.map((item) => (
                            <div key={item.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderRadius: '12px', gap: '1.5rem' }}>
                                <img 
                                    src={item.image_url || `https://placehold.co/100x100?text=${encodeURIComponent(item.name)}`} 
                                    alt={item.name} 
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                                
                                <div style={{ flex: 1 }}>
                                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600', fontSize: '1.1rem' }}>
                                        {item.name}
                                    </Link>
                                    <div style={{ color: '#4f46e5', fontWeight: '700', marginTop: '0.5rem' }}>
                                        ${item.price}
                                    </div>
                                </div>

                                <div>
                                    <select 
                                        value={item.qty} 
                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                    >
                                        {[...Array(Math.min(item.stock, 10)).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                                    title="Remove from cart"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                            <h2 style={{ marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                                Order Summary
                            </h2>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#4a4a68' }}>
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>${cartTotalPrice}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#4a4a68' }}>
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: '700' }}>
                                <span>Total</span>
                                <span style={{ color: '#4f46e5' }}>${cartTotalPrice}</span>
                            </div>

                            <button 
                                onClick={checkoutHandler}
                                className="btn btn-primary btn-block"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
