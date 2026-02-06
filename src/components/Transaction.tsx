import React from 'react';

interface TransactionProps {
    id: number;
    date: string;
    category: string;
    amount: number | string;
    description: string;
    onDelete: (id: number) => void;
    onClick?: () => void;
}

const Transaction: React.FC<TransactionProps> = ({id, date, category, amount, description, onDelete, onClick}) => {
    return (
        <tr>
        <td>{date}</td>
        <td><span className="badge rounded-pill bg-info text-dark">{category}</span></td>
        <td className="fw-bold text-danger">${Number(amount || 0).toFixed(2)}</td>
        <td>{description}</td>
        <td>
            <button className="btn btn-sm btn-outline-danger"
            onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
            }}
            >
                &times;
            </button>
        </td>
        </tr>
    );
};

export default Transaction;