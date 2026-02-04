import { useState } from 'react';
import './AddCardModalSummary.css';
import NewCardForm from './NewCardForm';


type AddCardModalProps = {
    onAddCardSubmit: (data: any) => void;
    onClose: () => void;
};

const AddCardModal: React.FC<AddCardModalProps> = ({ 
    onAddCardSubmit,
    onClose
}) => {

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <div className='form'>
                <div className='formContainer'>
                    <button className="close-x" onClick={handleClose}>&times;</button>
                    <NewCardForm onFormSubmit={onAddCardSubmit}></NewCardForm>
                </div>
            </div>
            <div 
                className='overlay__background' 
                onClick={onClose}
            ></div>
        </>
    );
};

export default AddCardModal;