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
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top shadow-sm">
        <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="/">Reward Tracker</a>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item"><a className="nav-link" href="/forum">Forum</a></li>
                    {user && (
                        <>
                            <li className="nav-item"><a className="nav-link" href="/summary">My Wallet</a></li>
                            <li className="nav-item"><a className="nav-link" href="/dashboard">Insights</a></li>
                        </>
                    )}
                </ul>

                <div className="d-flex align-items-center gap-2">
                    {user ? (
                        <div className="dropdown">
                            <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Hi, {user.username}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setSignUpLoginModal(true)}>
                            Sign Up / Log In
                        </button>
                    )}
                </div>
            </div>
        </div>

        {showSignUpLoginModal && (
            <SignUpLoginModal
                onSignupSubmit={handleSignup}
                onSigninSubmit={handleSignin}
                onClose={() => setSignUpLoginModal(false)}
            />
        )}
    </nav>
);
}