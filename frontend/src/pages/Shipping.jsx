import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Shipping = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Default to existing local storage or empty
    const [address, setAddress] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).address : '');
    const [city, setCity] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).city : '');
    const [postalCode, setPostalCode] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).postalCode : '');
    const [country, setCountry] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).country : '');

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=shipping');
        }
    }, [user, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="container section-padding animate-fade-in" style={{ maxWidth: '600px' }}>
            <CheckoutSteps step1 step2 />
            
            <div className="auth-card glass" style={{ maxWidth: '100%' }}>
                <h2>Shipping Address</h2>
                <p>Where should we send your order?</p>
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder="Enter postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            placeholder="Enter country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block">Continue to Payment</button>
                </form>
            </div>
        </div>
    );
};

export default Shipping;
