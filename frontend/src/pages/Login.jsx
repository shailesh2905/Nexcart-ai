import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css'; // We will create this for glassmorphism styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <h2>Welcome Back</h2>
                <p>Sign in to continue to NexCart AI</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                </form>
                
                <div className="auth-footer">
                    <p>New customer? <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}>Create an account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
