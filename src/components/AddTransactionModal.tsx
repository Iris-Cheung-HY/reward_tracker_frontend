import React from 'react';
import './AddTransactionModal.css';
import NewTransactionForm from './NewTransactionForm';

type AddTransactionModalProps = {
    cardId: number;
    onAddTransactionSubmit: (data: any) => void; 
    onClose: () => void;
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
    cardId,
    onAddTransactionSubmit,
    onClose
}) => {
    return (
        <div className="modal-fixed-wrapper">
            <div 
                className='overlay__background' 
                onClick={onClose}
            ></div>

            <div className='form' onClick={(e) => e.stopPropagation()}>
                <div className='formContainer'>
                    <div className="modal-header">
                        <h3>Add New Transaction</h3>
                        <button className="close-x" onClick={onClose}>&times;</button>
                    </div>
                    <NewTransactionForm 
                        cardId={cardId}
                        onFormSubmit={onAddTransactionSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;