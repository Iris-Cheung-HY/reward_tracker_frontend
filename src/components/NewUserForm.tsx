import { useState } from 'react';
import axios from 'axios';
import './NewUserForm.css';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

type NewUserFormData = {
    username: string;
    password: string;
    name: string;
    email: string;
}

type NewUserFormProps = {
    onFormSubmit: (data: NewUserFormData) => void;
}

const NewUserForm: React.FC<NewUserFormProps> = ({ onFormSubmit }) => {
    const defaultUserFormData: NewUserFormData = {
        username: '',
        password: '',
        name: '',
        email: '',
    };

    const [userFormData, setUserFormData] = useState(defaultUserFormData);
    const [errMsg, setErrMsg] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [disableSubmit, setDisableSubmit] = useState(true);

    const checkUsername = async (username: string) => {
        if (username.length < 3) return;
        try {
            const res = await axios.post(`${backendUrl}/users/check-username`, { username });
            
            setUsernameAvailable(res.data.available);
            
            if (res.data.available === false) {
                setErrMsg('Username is already taken');
                setDisableSubmit(true);
            } else {
                setErrMsg('');
                setDisableSubmit(false);
            }
        } catch (error) {
            console.error("Username check failed:", error);
            setUsernameAvailable(true); 
            setDisableSubmit(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        
        setUserFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (value.trim() === '') {
            setErrMsg(`${name} cannot be empty!`);
            setDisableSubmit(true);
        } else {
            setErrMsg('');
            setDisableSubmit(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (disableSubmit || usernameAvailable === false) {
            return;
        }

        onFormSubmit(userFormData);
        setUserFormData(defaultUserFormData);
        setErrMsg('');
        setDisableSubmit(true);
        setUsernameAvailable(null);
    };

    return (
        <form onSubmit={handleSubmit} className="newUserForm">
            <div className="formContainer">
                <div>
                    <p className="inputErrorMessage" style={{color: 'red'}}>{errMsg}</p>
                    <label htmlFor="username">Username</label>
                    <input
                        name="username"
                        type="text"
                        value={userFormData.username}
                        onChange={handleInputChange}
                        onBlur={() => checkUsername(userFormData.username)}
                        className="formInput"
                        placeholder="At least 3 characters"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={userFormData.password}
                        onChange={handleInputChange}
                        className="formInput"
                    />
                </div>

                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        type="text"
                        value={userFormData.name}
                        onChange={handleInputChange}
                        className="formInput"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={userFormData.email}
                        onChange={handleInputChange}
                        className="formInput"
                    />
                </div>
            </div>
            
            <button 
                className="submitButton" 
                type="submit" 
                disabled={disableSubmit || usernameAvailable === false}
            >
                Create Account
            </button>
        </form>
    );
};

export default NewUserForm;