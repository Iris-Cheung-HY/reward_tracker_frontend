import React, { useEffect, useState } from 'react';
import Benefit from './Benefit';

export interface RewardsDTO {
    merchantType: string;
    rewardRate: number | null;
    totalAmount: number | null;
    usedAmount: number;
    remainingAmount: number;
    lostAmount: number;
    type: 'POINTS' | 'CREDIT' | 'STATUS' | 'BENEFIT' | 'MILESTONE' | 'FREE_NIGHT';
    eligible: boolean;
    nextDueDate: string | null;
    conditions: string | null;
    displayMode: 'STATIC' | 'PROGRESS';
}

interface BenefitsListProps {
    userCardId: string;
}

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const BenefitsList: React.FC<BenefitsListProps> = ({ userCardId }) => {
    const [rewards, setRewards] = useState<RewardsDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userCardId || userCardId === "{userCardId}" || userCardId === "undefined") {
            setLoading(false);
            return;
        }

        const fetchBenefits = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${backendUrl}/bankrewards/card/${userCardId}/benefits`);
                
                if (!response.ok) throw new Error("Failed to fetch rewards");

                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setRewards(data);
                } else {
                    setRewards([]);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to load benefit progress.");
                setRewards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, [userCardId]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 mt-4">
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <div className="text-muted">Analyzing card benefits...</div>
            </div>
        );
    }


    if (error) {
        return <div className="alert alert-warning m-3 text-center" role="alert">{error}</div>;
    }

    if (rewards.length === 0) {
        return (
            <div className="text-center p-5 bg-light rounded shadow-sm">
                <p className="text-muted mb-0">No active benefits or reward rules found for this card.</p>
            </div>
        );
    }

    return (
        <div className="benefits-wrapper">
            <div className="d-flex align-items-center mb-4">
                <h4 className="fw-bold mb-0">Benefit Progress</h4>
                <span className="badge bg-secondary ms-2">{rewards.length} active</span>
            </div>

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