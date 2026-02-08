import React from 'react';
import { Modal } from 'react-bootstrap';
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
        <Modal 
            show={true} 
            onHide={onClose} 
            centered 
            backdrop="static" 
        >
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <Modal.Title className="fw-bold ps-2 mt-2">
                    Add New Transaction
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="px-4 pb-4">
                <NewTransactionForm 
                    cardId={cardId}
                    onFormSubmit={onAddTransactionSubmit}
                />
            </Modal.Body>
        </Modal>
    );
};

export default AddTransactionModal;