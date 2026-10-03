import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, CheckCircle, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';

const PlaceOrder = () => {
    const { user } = useContext(AuthContext);
    const { cartItems, cartTotalPrice, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod') || '"PayPal"');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Calculate Prices
    const itemsPrice = Number(cartTotalPrice);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=shipping');
        }
    }, [user, navigate]);

    const placeOrderHandler = async () => {
        try {
            setPaymentProcessing(true);
            
            // Simulate Payment Gateway Delay
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setPaymentSuccess(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                config
            );

            clearCart();
            setLoading(false);
            setPaymentProcessing(false);
            setPaymentSuccess(false);
            alert('Order Placed Successfully! Payment Processed via ' + paymentMethod);
            navigate('/');
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
            setPaymentProcessing(false);
            setPaymentSuccess(false);
        }
    };

    return (
        <div className="container section-padding animate-fade-in" style={{ position: 'relative' }}>
            {paymentProcessing && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(255,255,255,0.9)', zIndex: 100,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)', borderRadius: '16px'
                }}>
                    {!paymentSuccess ? (
                        <>
                            <div className="loader" style={{ marginBottom: '1.5rem', width: '50px', height: '50px', borderTopColor: '#4f46e5' }}></div>
                            <h2 style={{ color: '#1e293b' }}>Processing Payment...</h2>
                            <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <Lock size={16} /> Securely contacting {paymentMethod} Gateway
                            </p>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ color: '#10b981' }}>Payment Successful!</h2>
                            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Finalizing your order...</p>
                        </>
                    )}
                </div>
            )}
            
            <CheckoutSteps step1 step2 step3 step4 />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                        <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Shipping</h2>
                        <p style={{ color: '#4a4a68' }}>
                            <strong>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                        <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Payment Method</h2>
                        <p style={{ color: '#4a4a68' }}>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                        <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Order Items</h2>
                        {cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div>
                                {cartItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: index !== cartItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                                        <img 
                                            src={item.image_url || `https://placehold.co/50x50?text=${encodeURIComponent(item.name)}`} 
                                            alt={item.name} 
                                            style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                        <Link to={`/product/${item.id}`} style={{ flex: 1, textDecoration: 'none', color: '#1e293b', fontWeight: '500' }}>
                                            {item.name}
                                        </Link>
                                        <div style={{ color: '#4a4a68' }}>
                                            {item.qty} x ${item.price} = <span style={{ fontWeight: '700', color: '#4f46e5' }}>${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>Order Summary</h2>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4a4a68' }}>
                            <span>Items</span>
                            <span>${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4a4a68' }}>
                            <span>Shipping</span>
                            <span>${shippingPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4a4a68' }}>
                            <span>Tax</span>
                            <span>${taxPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: '700' }}>
                            <span>Total</span>
                            <span style={{ color: '#4f46e5' }}>${totalPrice}</span>
                        </div>

                        {error && <Message variant="danger">{error}</Message>}

                        <button 
                            className="btn btn-primary btn-block" 
                            disabled={cartItems.length === 0 || paymentProcessing}
                            onClick={placeOrderHandler}
                            style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <CreditCard size={20} />
                            {paymentProcessing ? 'Processing...' : `Pay $${totalPrice}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
