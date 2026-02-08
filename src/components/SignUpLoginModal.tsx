import React, { useState } from 'react';
import NewUserForm from './NewUserForm';
import LoginForm from './LoginForm';
import { Modal, Nav } from 'react-bootstrap';

type SignUpLoginModalProps = {
    onSignupSubmit: (data: any) => void;
    onSigninSubmit: (data: any) => void;
    onClose: () => void;
};

const SignUpLoginModal: React.FC<SignUpLoginModalProps> = ({ 
    onSignupSubmit, 
    onSigninSubmit,
    onClose
}) => {
    const [authTab, setAuthTab] = useState<'signup' | 'signin'>('signup');

    return (
        <Modal 
            show={true} 
            onHide={onClose} 
            centered 
            backdrop="static"
            contentClassName="rounded-4 shadow border-0"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold ps-2 mt-2">
                    {authTab === 'signup' ? 'Create Account' : 'Welcome Back'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 pb-4">
                <Nav 
                    variant="pills" 
                    activeKey={authTab} 
                    onSelect={(k) => setAuthTab(k as 'signup' | 'signin')}
                    className="mb-4 bg-light p-1 rounded-pill"
                    justify
                >
                    <Nav.Item>
                        <Nav.Link eventKey="signup" className="rounded-pill fw-bold">
                            Sign Up
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="signin" className="rounded-pill fw-bold">
                            Sign In
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <div className="auth-form-container">
                    {authTab === 'signup' ? (
                        <NewUserForm onFormSubmit={onSignupSubmit} />
                    ) : (
                        <LoginForm onFormSubmit={onSigninSubmit} />
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SignUpLoginModal;