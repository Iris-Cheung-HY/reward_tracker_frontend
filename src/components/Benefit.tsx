import React from 'react';
import type { RewardsDTO } from './BenefitsList';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface BenefitProps {
    reward: RewardsDTO;
}

const Benefit: React.FC<BenefitProps> = ({ reward }) => {
    const isPoints = reward.type === 'POINTS';
    const isFreeNight = reward.type === 'FREE_NIGHT';
    const isCredit = reward.type === 'CREDIT';

    const hasLimit = reward.totalAmount !== null && reward.totalAmount > 0;
    const progressPercent = hasLimit 
        ? Math.min((reward.usedAmount / (reward.totalAmount || 1)) * 100, 100)
        : 0;

    return (
        <div className={`card h-100 shadow-sm border-0 position-relative ${reward.eligible ? 'border-start border-success border-5' : 'border-start border-light border-5'}`} style={{ borderRadius: '12px' }}>
            <div className="card-body d-flex flex-column">
                
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <span className="text-uppercase text-primary fw-bold small ls-wide">
                            {reward.merchantType.replace(/_/g, ' ')}
                        </span>
                        {reward.conditions && (
                            <div className="text-muted x-small mt-1 fst-italic">
                                {reward.conditions.length > 40 
                                    ? `${reward.conditions.substring(0, 40)}...` 
                                    : reward.conditions
                                }
                            </div>
                        )}
                    </div>
                    
                    {reward.conditions && (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${reward.merchantType}`}>{reward.conditions}</Tooltip>}
                        >
                            <span className="badge rounded-pill bg-light text-dark border ms-2" style={{ cursor: 'help' }}>?</span>
                        </OverlayTrigger>
                    )}
                </div>

                <div className="flex-grow-1 py-2">
                    {isPoints ? (
                        <div className="points-info">
                            <div className="d-flex align-items-baseline gap-1">
                                <h2 className="fw-bold text-dark mb-0">{reward.usedAmount.toLocaleString()}</h2>
                                <span className="text-muted small fw-medium">Points</span>
                            </div>
                            <div className="mt-2">
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                    Earn Rate: {reward.rewardRate}x
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="credit-info">
                            <div className="d-flex justify-content-between align-items-end mb-1">
                                <h3 className="fw-bold mb-0">
                                    {isFreeNight && reward.totalAmount! <= 1 
                                        ? "1 Night" 
                                        : `$${reward.usedAmount.toFixed(0)}`
                                    }
                                    {hasLimit && <span className="text-muted fs-6 fw-normal"> / ${reward.totalAmount}</span>}
                                </h3>
                                {reward.eligible && <span className="text-success small fw-bold">✓ Ready</span>}
                            </div>

                            {hasLimit && (
                                <div className="progress mt-2" style={{ height: '8px', backgroundColor: '#f0f0f0' }}>
                                    <div 
                                        className={`progress-bar ${reward.eligible ? 'bg-success' : 'bg-info'} progress-bar-striped`} 
                                        style={{ width: `${progressPercent}%`, borderRadius: '4px' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {reward.nextDueDate && (
                    <div className="mt-3 pt-2 border-top border-light d-flex align-items-center text-muted" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-clock-history me-1"></i>
                        <span>Resets: <strong>{new Date(reward.nextDueDate).toLocaleDateString()}</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Benefit;