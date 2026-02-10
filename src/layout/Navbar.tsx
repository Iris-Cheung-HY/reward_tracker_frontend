import React, { useState } from "react";
import './Navbar.css';
import SignUpLoginModal from '../components/SignUpLoginModal';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../public/image/";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

type NewUserFormData = {
    username: string;
    password: string;
    name: string;
    email: string;
}

type LoginFormData = {
    username: string;
    password: string;
}

interface User {
    id: number;
    username: string;
    token?: string; 
}

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

    const handleSignup = async (formData: NewUserFormData) => {
        try {
            const response = await axios.post(`${backendUrl}/users`, formData);
            updateSession(response.data);
            alert('Sign up Success!');
        } catch (error: any) {
            const errorMessage = error.response?.status === 409 
                ? "Username or Email already exists!" 
                : "Signup failed, please try again.";
            alert(errorMessage);
        }
    };

    const handleSignin = async (formData: LoginFormData) => {
        try {
            const response = await axios.post(`${backendUrl}/users/login`, formData);
            
            if (response.data?.username) {
                updateSession(response.data);
                alert(`Welcome Back, ${response.data.username}!`);
                navigate("/summary");
            } else {
                alert("Login failed: Invalid credentials");
            }
        } catch (error: any) {
            alert("Login failed: Wrong credentials or server error");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        alert("Logged out successfully");
        navigate("/");
    };

return (
    <>
        <nav className="custom-navbar fixed-top">
            <div className="navbar-container">
                <Link to="/" className="brand-logo">
                    <img src={logo} alt="Reward Tracker" className="logo-image" />
                </Link>

                <div className="nav-actions">
                    {user ? (
                        <div className="user-menu">
                            <Link className="nav-link" to="/">Forum</Link>
                            <Link className="nav-link" to="/summary">My Wallet</Link>
                            
                            <div className="user-profile">
                                <span className="welcome-text">Hi, {user.username}</span>
                                <button className="logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
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