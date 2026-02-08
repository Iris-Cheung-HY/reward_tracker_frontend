import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

type RewardInfo = {
    merchantType: string;
    rewardRate: number | null;
    conditions: string | null;
    type: string;
};

type NewTransactionFormData = {
    date: string;
    merchantType: string;
    amount: number | string;
    description: string;
}

type NewTransactionFormProps = {
    onFormSubmit: (data: NewTransactionFormData) => void;
    cardId: number; 
}

const NewTransactionForm: React.FC<NewTransactionFormProps> = ({ onFormSubmit, cardId }) => {
    const [formData, setFormData] = useState<NewTransactionFormData>({
        date: new Date().toISOString().split('T')[0] || "", 
        merchantType: '',
        amount: '',
        description: '',
    });

    const [cardRules, setCardRules] = useState<RewardInfo[]>([]);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        const fetchCardBenefits = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${backendUrl}/bankrewards/card/${cardId}/benefits`);
                const spendRules = res.data.filter((r: any) => r.type === 'POINTS');
                setCardRules(spendRules);
            } catch (error) {
                console.error("Fetch card benefits failed:", error);
                setErrMsg("Failed to load card categories.");
            } finally {
                setLoading(false);
            }
        };
        if (cardId) fetchCardBenefits();
    }, [cardId]);

    const selectedRule = cardRules.find(r => r.merchantType === formData.merchantType);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!formData.date || !formData.merchantType || !formData.amount || !formData.description) {
            setErrMsg('Please fill out all fields');
            return;
        }
        setErrMsg('');
        onFormSubmit({ ...formData, amount: Number(formData.amount) });
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-body">
                <div className="form-group mb-3">
                    <label className="form-label fw-bold">Date</label>
                    <input name="date" type="date" className="form-control" value={formData.date} onChange={handleInputChange} required />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label fw-bold">Category</label>
                    {!isCustomCategory ? (
                        <select 
                            name="merchantType" 
                            className="form-select border-primary"
                            value={formData.merchantType} 
                            onChange={(e) => {
                                if (e.target.value === "CUSTOM_OTHER") {
                                    setIsCustomCategory(true);
                                    setFormData(prev => ({ ...prev, merchantType: '' }));
                                } else {
                                    handleInputChange(e);
                                }
                            }}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Select Bonus Category --</option>
                            {cardRules.map(rule => (
                                <option key={rule.merchantType} value={rule.merchantType}>
                                    {rule.merchantType} ({rule.rewardRate}x)
                                </option>
                            ))}
                            <option value="CUSTOM_OTHER">+ Other / General Spend</option>
                        </select>
                    ) : (
                        <div className="input-group">
                            <input 
                                name="merchantType"
                                className="form-control" 
                                placeholder="Enter category (e.g. Hospital)"
                                value={formData.merchantType}
                                onChange={handleInputChange}
                                required
                            />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setIsCustomCategory(false)}>
                                Back to List
                            </button>
                        </div>
                    )}
                    
                    {selectedRule?.conditions && (
                        <div className="form-text text-muted mt-2 small">
                            <i className="bi bi-info-circle me-1"></i>
                            <strong>Note:</strong> {selectedRule.conditions}
                        </div>
                    )}
                </div>

                <div className="form-group mb-3">
                    <label className="form-label fw-bold">Amount</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input name="amount" type="number" step="0.01" className="form-control" placeholder="0.00" value={formData.amount} onChange={handleInputChange} required />
                    </div>
                </div>

                <div className="form-group mb-4">
                    <label className="form-label fw-bold">Merchant / Description</label>
                    <input
                        name="description"
                        type="text"
                        placeholder="e.g. Starbucks, Delta Airlines..."
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>

            {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}

            <button className="btn btn-primary w-100 py-2 fw-bold" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Add Transaction"}
            </button>
        </form>
    );
};

export default NewTransactionForm;