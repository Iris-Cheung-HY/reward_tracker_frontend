import React from 'react';
import type { RewardsDTO } from './BenefitsList';

interface BenefitProps {
    reward: RewardsDTO;
}

const Benefit: React.FC<BenefitProps> = ({ reward }) => {
    const isPoints = reward.type === 'POINTS';
    const isFreeNight = reward.type === 'FREE_NIGHT';
    const isCredit = reward.type === 'CREDIT';

    const progressPercent = Math.min(
        (reward.usedAmount / (reward.totalAmount || 1)) * 100, 
        100
    );

    return (
        <div className={`card h-100 shadow-sm border-0 benefit-card transition-all ${reward.eligible ? 'border-top border-success border-4' : ''}`}>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-uppercase text-muted fw-bold x-small tracking-wider">
                        {reward.merchantType}
                    </span>
                    {reward.conditions && (
                        <span className="text-info" title={reward.conditions} style={{ cursor: 'help' }}>
                             ℹ️
                        </span>
                    )}
                </div>

                {isPoints && (
                    <div className="points-content">
                        <div className="d-flex align-items-baseline gap-1">
                            <h2 className="fw-bold text-primary mb-0">{reward.rewardRate}x</h2>
                            <span className="text-muted small">Points</span>
                        </div>
                        <p className="small text-secondary mt-2">Spent: ${reward.usedAmount.toLocaleString()}</p>
                    </div>
                )}

                {(isCredit || isFreeNight) && (
                    <div className="progress-content">
                        <div className="d-flex justify-content-between align-items-end mb-1">
                            <h3 className="fw-bold mb-0">
                                {isFreeNight ? `${reward.usedAmount.toFixed(0)} / ${reward.totalAmount} Night` : `$${reward.usedAmount.toFixed(0)}`}
                            </h3>
                            <span className="text-muted small">Goal: ${reward.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="progress mb-2" style={{ height: '10px', borderRadius: '5px' }}>
                            <div 
                                className={`progress-bar ${reward.eligible ? 'bg-success' : 'bg-info'} progress-bar-striped progress-bar-animated`} 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="small mb-0 text-secondary">
                            {reward.eligible ? "✅ Goal Achieved!" : `Almost there, $${reward.remainingAmount.toLocaleString()} more to go`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Benefit;