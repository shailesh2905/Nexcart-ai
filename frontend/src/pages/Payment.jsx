import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState(
        localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : 'PayPal'
    );

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=shipping');
        } else if (!localStorage.getItem('shippingAddress')) {
            navigate('/shipping');
        }
    }, [user, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="container section-padding animate-fade-in" style={{ maxWidth: '600px' }}>
            <CheckoutSteps step1 step2 step3 />
            
            <div className="auth-card glass" style={{ maxWidth: '100%' }}>
                <h2>Payment Method</h2>
                <p>Select your preferred payment method</p>
                
                <form onSubmit={submitHandler}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '2rem 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: paymentMethod === 'PayPal' ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }}>
                            <input
                                type="radio"
                                id="PayPal"
                                name="paymentMethod"
                                value="PayPal"
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            PayPal or Credit Card
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: paymentMethod === 'Stripe' ? 'rgba(79, 70, 229, 0.05)' : 'transparent' }}>
                            <input
                                type="radio"
                                id="Stripe"
                                name="paymentMethod"
                                value="Stripe"
                                checked={paymentMethod === 'Stripe'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Stripe
                        </label>
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block">Continue to Review Order</button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
