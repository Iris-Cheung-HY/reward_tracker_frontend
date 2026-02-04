import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface AnnualFee {
    annualFee: number;
}

interface UserSession {
    id: number;
    username?: string;
}

const AnnualFeeTotal: React.FC = () => {
    const [totalFee, setTotalFee] = useState<number>(0);

    const grabFee = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const user: UserSession = JSON.parse(storedUser);
            
            const res = await axios.get<number>(`${backendUrl}/usercreditcard/user/${user.id}/total-annual-fee`);
            setTotalFee(res.data);
        } catch (error) {
            console.error("Fetch error", error);
        }
    };

    useEffect(() => {
        grabFee()
    }, []);

    return (
        <div className="summary-card fee-card">
            <div className="card-header">
                <h3>Total Annual Fees</h3>
            </div>
            <div className="card-body">
                <p className="amount">
                    ${totalFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="period">per year</span>
            </div>
        </div>
    );
};

export default AnnualFeeTotal;