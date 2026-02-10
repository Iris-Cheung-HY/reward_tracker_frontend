import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import logo from "/image/logo.png";
import SignUpLoginModal from '../components/SignUpLoginModal';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

type NewUserFormData = { username: string; password: string; name: string; email: string; }
type LoginFormData = { username: string; password: string; }
interface User { id: number; username: string; token?: string; }

export default function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [showSignUpLoginModal, setSignUpLoginModal] = useState(false);

    const updateSession = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setSignUpLoginModal(false);
    };

    const handleSignup = (formData: NewUserFormData) => {
        axios.post(`${backendUrl}/users`, formData)
            .then(response => {
                updateSession(response.data);
                alert('Sign up Success!');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSignin = (formData: LoginFormData) => {
        axios.post(`${backendUrl}/users/login`, formData)
            .then(response => {
                if (response.data.username) {
                    updateSession(response.data);
                    navigate("/summary");
                }
            })
            .catch(error => {
                console.log(error);
                alert("Login failed!");
            });
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate("/");
    };

    return (
        <>
            <nav className="custom-navbar">
                <div className="navbar-container">
                    <Link to="/" className="brand-logo">
                        <img src={logo} alt="Logo" className="logo-image" />
                    </Link>

                    <div className="nav-actions">
                        {user ? (
                            <div className="user-menu">
                                <Link className="nav-link" to="/">Forum</Link>
                                <Link className="nav-link" to="/summary">My Wallet</Link>
                                <div className="user-profile">
                                    <span className="welcome-text">Hi, {user.username}</span>
                                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        ) : (
                            <button className="login-button" onClick={() => setSignUpLoginModal(true)}>
                                Sign Up / Log In
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {showSignUpLoginModal && (
                <SignUpLoginModal
                    onSignupSubmit={handleSignup}
                    onSigninSubmit={handleSignin}
                    onClose={() => setSignUpLoginModal(false)}
                />
            )}
        </>
    );
}