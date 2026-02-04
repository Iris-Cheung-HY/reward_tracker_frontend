import { useState } from 'react';
import './AddCardModalSummary.css';
import NewCardForm from './NewCardForm';


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

    const handleClose = () => {
        onClose();
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

    return (
        <>
            <div className='form'>
                <div className='formContainer'>
                    <button className="close-x" onClick={handleClose}>&times;</button>
                    
                    <h2>{authTab === 'signup' ? 'Create Account' : 'Sign In'}</h2>
                    
                    {renderTabButtons()}
                    
                    {authTab === 'signup' ? (
                        <NewUserForm onFormSubmit={onSignupSubmit} />
                    ) : (
                        <LoginForm onFormSubmit={onSigninSubmit} />
                    )}
                </div>
            </div>
            <div 
                className='overlay__background' 
                onClick={onClose}
            ></div>
        </>
    );
};

export default SignUpLoginModal;