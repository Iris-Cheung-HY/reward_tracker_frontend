import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const NewPostForm: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = "";

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', 'reward_tracker');
                
                const cloudRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/dpfccbrwk/image/upload`,
                    formData
                );
                imageUrl = cloudRes.data.secure_url;
            }

            const savedUser = localStorage.getItem('user');
            const currentUserId = savedUser ? JSON.parse(savedUser).id : null;

            const postData = {
                title: title,
                body: body,
                category: category,
                imageUrl: imageUrl,
                user_id: currentUserId
            }

            await axios.post(`${backendUrl}/posts`, postData)

            alert("Post Success！");
            navigate('/forum');
        } catch (error) {
            console.error(error);
            alert("Please try again later!");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '100px', maxWidth: '600px' }}>
            <h2>New Post</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-3" placeholder="Title" onChange={e => setTitle(e.target.value)} required />
                
                <input 
                    type="file" 
                    className="form-control mb-3" 
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file)
                    }}
                />

                <textarea 
                    className="form-control mb-3" 
                    placeholder="Content" 
                    value={body} 
                    onChange={e => setBody(e.target.value)} 
                    required 
                />              
                <button type="submit" className="btn btn-primary w-100" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Publish Post"}
                </button>
            </form>
        </div>
    );
};

export default NewPostForm;