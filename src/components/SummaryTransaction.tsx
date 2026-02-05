import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface transactionAmount {
    amount: number;
}

interface UserSession {
    id: number;
    username?: string;
}

const TotalTransactionTotal: React.FC = () => {
    const [totalTransactionAmount, setTotalTransactionAmount] = useState<number>(0);

    let currentDate: Date = new Date();

    const grabTotalAmount = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const user: UserSession = JSON.parse(storedUser);
            
            const res = await axios.get<number>(`${backendUrl}/transactionrecords/user/${user.id}/total-transaction`);
            setTotalTransactionAmount(res.data);
        } catch (error) {
            console.error("Fetch error", error);
        }
    };

    useEffect(() => {
        grabTotalAmount()
    }, []);

    return (
        <div className="summary-trans trans">
            <div className="trans-header">
                <h3>Total Transactions</h3>
            </div>
            <div className="trans-body">
                <p className="amount">
                    `${totalTransactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                </p>
                <span className="period">as of {currentDate.toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default TotalTransactionTotal;