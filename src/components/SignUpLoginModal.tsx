import { useState } from 'react';
import './SignUpLoginModal.css';
import NewUserForm from './NewUserForm';
import LoginForm from './LoginForm';

// 1. 定義 Prop 型別，加入 onClose
type SignUpLoginModalProps = {
    onSignupSubmit: (data: any) => void;
    onSigninSubmit: (data: any) => void;
    onClose: () => void; // 新增：用來關閉 Modal 的函數
};

const SignUpLoginModal: React.FC<SignUpLoginModalProps> = ({ 
    onSignupSubmit, 
    onSigninSubmit,
    onClose // 2. 解構出來
}) => {

    const [authTab, setAuthTab] = useState<'signup' | 'signin'>('signup');

    // 3. 修改：這應該直接執行父組件傳來的 onClose
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
                    {/* 加入一個小 X 按鈕在右上角也是不錯的選擇 */}
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
            {/* 4. 修改：點擊背景時觸發 handleClose */}
            <div 
                className='overlay__background' 
                onClick={onClose}
            ></div>
        </>
    );
};

export default SignUpLoginModal;