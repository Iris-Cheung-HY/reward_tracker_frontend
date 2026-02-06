import React from 'react';
import Transaction from './Transaction';
import './CardList.css';

interface TransactionItem {
    id: number;
    date: string;
    category: string;
    amount: number;
    description: string;
}

interface TransactionListProps {
    transactions: TransactionItem[];
    onDelete: (id: number) => void;
    onAdd: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onAdd }) => {
    return (
        <div className="trans-list-container shadow-sm rounded bg-white p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Transaction History</h5>
                <button className="btn btn-primary btn-sm" onClick={onAdd}>
                    <span className="me-1">+</span> Add Transaction
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '15%' }}>Date</th>
                            <th style={{ width: '20%' }}>Category</th>
                            <th style={{ width: '15%' }}>Amount</th>
                            <th style={{ width: '40%' }}>Merchant</th>
                            <th style={{ width: '10%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <Transaction
                                    key={transaction.id}
                                    id={transaction.id}
                                    date={transaction.date}
                                    category={transaction.category}
                                    amount={transaction.amount}
                                    description={transaction.description}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList;