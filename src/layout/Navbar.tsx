import React, { useState } from "react";
import './Navbar.css';
import SignUpLoginModal from '../components/SignUpLoginModal';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

    const handleSignup = async (formData: NewUserFormData) => {
        try {
            const response = await axios.post(`${backendUrl}/users`, formData);
            const newUser = response.data;
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            alert('Sign up Success！');
            setSignUpLoginModal(false);
        } catch (error: any) {
            if (error.response?.status === 409) {
                alert("Username or Email Exist!");
            } else {
                alert("Signup failed, please try again.");
            }
        }
    };

    const handleSignin = async (formData: LoginFormData) => {
        try {
            const response = await axios.post(`${backendUrl}/users/login`, formData);
            
            if (response.data && response.data.username) {
                const loginUser = response.data;
                setUser(loginUser);
                localStorage.setItem('user', JSON.stringify(loginUser));
                alert(`Welcome Back, ${loginUser.username}!`);
                setSignUpLoginModal(false);

                navigate("/summary");
            } else {
                alert("Login failed: Invalid username or password");
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
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top shadow-sm">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">Reward Tracker</span>

                    <div className="d-flex align-items-center ms-auto">
                        {user ? (
                            <div className="d-flex align-items-center gap-4">
                                <Link className="nav-link fw-semibold" to="/">Forum</Link>
                                <Link className="nav-link fw-semibold" to="/summary">My Wallet</Link>
                                
                                <div className="d-flex align-items-center ms-2 border-start ps-4">
                                    <span className="text-secondary me-3">Hi, {user.username}</span>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                className="btn btn-primary px-4"
                                onClick={() => setSignUpLoginModal(true)}
                            >
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

