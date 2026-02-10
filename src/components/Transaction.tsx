import React from 'react';
import "./Transaction.css";

interface TransactionProps {
    id: number;
    date: string;
    category: string;
    amount: number | string;
    description: string;
    onDelete: (id: number) => void;
}

const Transaction: React.FC<TransactionProps> = ({ id, date, category, amount, description, onDelete }) => {
    return (
        <div className="transaction-item-row">
            <div className="t-col date-col">{date}</div>
        
            <div className="t-col category-col">
                <span className="category-pill">{category}</span>
            </div>
            
            <div className="t-col amount-col">
                ${Number(amount || 0).toFixed(2)}
            </div>
            
            <div className="t-col merchant-col" title={description}>
                {description}
            </div>
            
            <div className="t-col action-col">
                <button 
                    className="delete-item-x"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Transaction;