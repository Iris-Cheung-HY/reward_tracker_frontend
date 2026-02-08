import React from 'react';
import { Modal } from 'react-bootstrap';
import NewCardForm from './NewCardForm';

type AddCardModalProps = {
    onAddCardSubmit: (data: any) => void;
    onClose: () => void;
};

const AddCardModal: React.FC<AddCardModalProps> = ({ 
    onAddCardSubmit,
    onClose
}) => {
    return (

        <Modal 
            show={true} 
            onHide={onClose} 
            centered 
            size="lg" 
            backdrop="static"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold ps-2 mt-2">Add New Credit Card</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="px-4 pb-4">
                <NewCardForm onFormSubmit={onAddCardSubmit} />
            </Modal.Body>
        </Modal>
    );
};

export default AddCardModal;