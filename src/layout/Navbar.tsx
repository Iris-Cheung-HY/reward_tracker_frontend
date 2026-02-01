import React, { useState } from "react";
import './Navbar.css';
import SignUpLoginModal from '../components/SignUpLoginModal';
import axios from "axios";

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
    userId: number;
    username: string;
    token?: string; 
}

export default function Navbar() {
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
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Reward Tracker</a>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarSupportedContent"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="d-flex align-items-center">
                        {user && (
                            <button 
                                className="btn btn-sm btn-link text-decoration-none me-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => setSignUpLoginModal(true)}
                        >

                            {user ? `Hi, ${user.username}` : "Sign Up / Log In"}
                        </button>
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