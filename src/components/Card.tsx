import React from 'react';

interface CardProps {
    id: number;
    image: string;
    lastFourDigits: string;
    openMonth: string;
    onDelete: (id: number) => void;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ id, image, lastFourDigits, openMonth, onDelete, onClick }) => {
    return (
        <div 
            className="card h-100 border-0 shadow-sm custom-card-hover" 
            style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }}
            onClick={onClick}
        >
            <button 
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3" 
                style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))', fontSize: '0.8rem' }}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                }}
            ></button>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '1.58 / 1', backgroundColor: '#f8f9fa' }}>
                <img 
                    src={image} 
                    alt="Credit Card" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }} 
                />
                
                <div 
                    className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
                >
                    <div className="d-flex justify-content-between align-items-end">
                        <span className="font-monospace fw-bold" style={{ letterSpacing: '2px' }}>
                            **** {lastFourDigits}
                        </span>
                        <span className="x-small opacity-75" style={{ fontSize: '0.7rem' }}>
                            {openMonth}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-card-hover {
                    transition: all 0.3s ease;
                }
                .custom-card-hover:hover {
                    transform: translateY(-5px); /* 簡單的向上位移 */
                    shadow: 0 1rem 3rem rgba(0,0,0,0.175) !important; /* 加深陰影 */
                }
                .x-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default Card;