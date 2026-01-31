import React, { useState } from "react";
import './Navbar.css';
import SignUpLoginModal from '../components/SignUpLoginModal';

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


export default function Navbar() {
    const [showSignUpLoginModal, setSignUpLoginModal] = useState(false);

      const handleSignup = (formData: NewUserFormData) => {
        console.log('Sign Up', formData);
        // TODO: axios.post('/api/users', formData)
        alert('Sign up Success！');
        setSignUpLoginModal(false);
      };

      const handleSignin = (formData: LoginFormData) => {
          console.log('Login:', formData);
          // TODO: axios.post('/api/users/login', formData)
          alert('Login Success！');
          setSignUpLoginModal(false);
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
                        aria-controls="navbarSupportedContent" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => setSignUpLoginModal(true)}
                    >
                        Sign Up / Log In
                    </button>
                </div>
            </nav>
            
            {showSignUpLoginModal && (
                <SignUpLoginModal
                    onSignupSubmit={handleSignup}
                    onSigninSubmit={handleSignin}
                />
            )}
        </>
    );
}
