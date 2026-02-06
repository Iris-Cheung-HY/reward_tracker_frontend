import React, { useEffect, useState } from 'react';
import Benefit from './Benefit';
import './BenefitsList.css';


export interface RewardsDTO {
    merchantType: string;
    rewardRate: number | null;
    totalAmount: number | null;
    usedAmount: number;
    remainingAmount: number;
    lostAmount: number;
    type: string; 
    eligible: boolean;
    nextDueDate: string;
}

interface BenefitsListProps {
    userCardId: string;
}

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const BenefitsList: React.FC<BenefitsListProps> = ({ userCardId }) => {
    const [rewards, setRewards] = useState<RewardsDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userCardId) return;

        setLoading(true);
        fetch(`${backendUrl}/bankrewards/card/${userCardId}/benefits`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch rewards");
                return res.json();
            })
            .then((data: RewardsDTO[]) => {
                setRewards(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [userCardId]);

    if (loading) return <div className="p-4 text-center">Loading benefits...</div>;
    if (error) return <div className="alert alert-danger m-4">{error}</div>;

    return (
        <div className="benefits-container px-3">
            <h3 className="mb-4 fw-bold">Card Benefits & Tracking</h3>
            <div className="row g-4">
                {rewards.map((reward, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={`${reward.merchantType}-${index}`}>
                        <Benefit reward={reward} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BenefitsList;