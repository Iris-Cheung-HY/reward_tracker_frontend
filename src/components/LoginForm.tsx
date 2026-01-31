import { useState } from 'react';
import axios from 'axios';

type LoginFormData = {
    username: string;
    password: string;
}

type LoginFormProps = {
    onFormSubmit: (data: LoginFormData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onFormSubmit }) => {
    const defaultLoginData: LoginFormData = {
        username: '',
        password: '',
    };

    const [loginData, setLoginData] = useState(defaultLoginData);
    const [errMsg, setErrMsg] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name as keyof LoginFormData;
        const inputValue = event.target.value;
        
        setLoginData(prev => ({
            ...prev,
            [inputName]: inputValue
        }));

        const allFieldsFilled = loginData.username && loginData.password;
        
        if (inputValue.length === 0) {
            const fieldErrors: Record<string, string> = {
                username: 'Username cannot be empty!',
                password: 'Password cannot be empty!'
            };
            setErrMsg(fieldErrors[inputName]);
            setDisableSubmit(true);
        } else {
            setErrMsg('');
            setDisableSubmit(!allFieldsFilled);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (disableSubmit) return;
        onFormSubmit(loginData);
    };

    return (
        <form onSubmit={handleSubmit} className="loginForm">
            <div className="formContainer">
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        name="username"
                        type="text"
                        value={loginData.username}
                        onChange={handleInputChange}
                        className="formInput"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        className="formInput"
                    />
                    <p className="inputErrorMessage">{errMsg}</p>
                </div>
            </div>
            <button 
                className="submitButton" 
                type="submit" 
                disabled={disableSubmit}
            >
                Sign In
            </button>
        </form>
    );
};

export default LoginForm;
