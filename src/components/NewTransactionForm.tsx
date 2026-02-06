import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

type RewardInfo = {
    id: number;
    merchantType: string;
    rewardRate: number | null;
    type: string;
    conditions: string;
    totalAmount: number | null;
};

type NewTransactionFormData = {
    date: string;
    category: string;
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
        category: '',
        amount: '',
        description: '',
    });

    const [rewards, setRewards] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
            const fetchCategories = async () => {
                try {
                    setLoading(true);
                    const res = await axios.get(`${backendUrl}/bankcardrewards/categories`);
                    
                    if (res.data && res.data.length > 0) {
                        if (typeof res.data[0] === 'object') {
                            const categoryNames = res.data.map((item: any) => item.merchantType || item.category);
                            setRewards(categoryNames);
                        } else {
                            setRewards(res.data);
                        }
                    } 
                } catch (error) {
                    console.error("Fetch categories failed:", error);
                    setErrMsg("Failed to load categories.");
                } finally {
                    setLoading(false);
                }
            };

            if (cardId) {
                fetchCategories();
            }
        }, [cardId]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.date || !formData.category || !formData.amount || !formData.description) {
            setErrMsg('Please fill out all fields');
            return;
        }

        if (Number(formData.amount) <= 0) {
            setErrMsg('Please enter a positive amount');
            return;
        }

        setErrMsg('');
        
        onFormSubmit({
            ...formData,
            amount: Number(formData.amount)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-body">
                <div className="form-group mb-3">
                    <label className="form-label">Date</label>
                    <input
                        name="date"
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Category</label>
                    <select 
                        name="category" 
                        className="form-select"
                        value={formData.category} 
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    >
                        <option value="">-- {loading ? "Loding" : "Select Category"} --</option>
                        {rewards.map(rew => (
                            <option key={rew} value={rew}>{rew}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="form-control"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Description</label>
                    <input
                        name="description"
                        type="text"
                        placeholder="Description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>

            {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}

            <div className="form-footer mt-4">
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    Add Transaction
                </button>
            </div>
        </form>
    );
};

export default NewTransactionForm;