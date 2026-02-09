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
        <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-4 border-start border-primary border-5">
            <h6 className="fw-bold">Total Spend</h6>
            <h2 className="fw-bold mb-0 text-dark">
                ${totalTransactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <span className="text-muted small mt-2">as of {currentDate.toLocaleDateString()}</span>
        </div>
    );
};

export default TotalTransactionTotal;