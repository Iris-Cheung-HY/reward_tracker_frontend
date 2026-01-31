import { useState } from 'react';
import axios from 'axios';
import './NewUserForm.css';

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
            const res = await axios.post('/api/users/check-username', { username });
            setUsernameAvailable(res.data.available);
            if (!res.data.available) {
                setErrMsg('Username is not available, please enter another username or hit sign in');
                setDisableSubmit(true);
            }
        } catch (error) {
            setDisableSubmit(true);
        }
    };

    const makeControlledInput = (inputName: keyof NewUserFormData, inputType = 'text') => {
        return (
            <input
                name={inputName}
                type={inputType}
                value={userFormData[inputName]}
                onChange={handleInputChange}
                onBlur={inputName === 'username' ? () => checkUsername(userFormData.username) : undefined}
                className="formInput"
            />
        );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        
        setUserFormData(prev => ({
            ...prev,
            [inputName]: inputValue
        }));

        if (inputName === 'username' && inputValue.length === 0) {
            setErrMsg('Username cannot be empty!');
            setDisableSubmit(true);
        } else if (inputValue.length > 0) {
            setErrMsg('');
            setDisableSubmit(false);
        }

        if (inputName === 'password' && inputValue.length === 0) {
            setErrMsg('Password cannot be empty!')
            setDisableSubmit(true);
        } else if (inputValue.length > 0) {
            setErrMsg('');
            setDisableSubmit(false);
        }

        if (inputName === 'email' && inputValue.length === 0) {
            setErrMsg('Email cannot be empty!')
            setDisableSubmit(true);
        } else if (inputValue.length > 0) {
            setErrMsg('');
            setDisableSubmit(false);
        }

        if (inputName === 'name' && inputValue.length === 0) {
            setErrMsg('Name cannot be empty!')
            setDisableSubmit(true);
        } else if (inputValue.length > 0) {
            setErrMsg('');
            setDisableSubmit(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (disableSubmit || !usernameAvailable) return;

        onFormSubmit(userFormData);
        setUserFormData(defaultUserFormData);
        setErrMsg('');
        setDisableSubmit(true);
        setUsernameAvailable(null);
    };

    return (
        <form onSubmit={handleSubmit} className="newUserForm">
            <div className="formContainer">
                {/* Username */}
                <div>
                    <p className="inputErrorMessage">{errMsg}</p>
                    <label htmlFor="username">Username</label>
                    {makeControlledInput('username')}

                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password">Password</label>
                    {makeControlledInput('password', 'password')}
                </div>

                {/* Name */}
                <div>
                    <label htmlFor="name">Name</label>
                    {makeControlledInput('name')}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email">Email</label>
                    {makeControlledInput('email')}
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
