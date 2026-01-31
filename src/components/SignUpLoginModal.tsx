import { useState } from 'react';
import './SignUpLoginModal.css';
import NewUserForm from './NewUserForm';
import LoginForm from './LoginForm';

type SignUpLoginModalProps = {
    onSignupSubmit: (data: any) => void;
    onSigninSubmit: (data: any) => void;
};

const SignUpLoginModal: React.FC<SignUpLoginModalProps> = ({ 
    onSignupSubmit, 
    onSigninSubmit 
}) => {

    const [authTab, setAuthTab] = useState<'signup' | 'signin'>('signup');

    const toggleModal = () => {
    };

    const renderTabButtons = () => (
        <div className="tab-buttons">
            <button 
                className={`tab-btn ${authTab === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthTab('signup')}
            >
                Sign Up
            </button>
            <button 
                className={`tab-btn ${authTab === 'signin' ? 'active' : ''}`}
                onClick={() => setAuthTab('signin')}
            >
                Sign In
            </button>
        </div>
    );

    const modalWindow = (
        <>
            <div className='form'>
                <div className='formContainer'>
                    <h2>{authTab === 'signup' ? 'Create Account' : 'Sign In'}</h2>
                    
                    {renderTabButtons()}
                    
                    {authTab === 'signup' ? (
                        <NewUserForm onFormSubmit={onSignupSubmit} />
                    ) : (
                        <LoginForm onFormSubmit={onSigninSubmit} />
                    )}
                </div>
            </div>
            <div className='overlay__background' onClick={toggleModal}></div>
        </>
    );
    return modalWindow


};

export default SignUpLoginModal;
