import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "./NewPostForm.css";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export const uploadImageAPI = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'reward_tracker');
    
    return axios.post(`https://api.cloudinary.com/v1_1/dpfccbrwk/image/upload`, formData)
        .then(res => res.data.secure_url);
};

export const createPostAPI = (postData: any) => {
    return axios.post(`${backendUrl}/posts`, postData)
        .then(res => res.data);
};

const kDefaultPostForm = {
    title: '',
    body: '',
    category: 'Travel' 
};

const NewPostForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ title: '', body: '', category: 'Travel' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) setForm(prev => ({ ...prev, category: cat }));
    }, [location.search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const isInvalid = form.title.trim() === '' || form.body.trim() === '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const uploadTask = imageFile ? uploadImageAPI(imageFile) : Promise.resolve("");

        uploadTask
            .then(imageUrl => {
                const finalPostData = {
                    ...form,
                    imageUrl: imageUrl,
                    user_id: user.id
                };
                return createPostAPI(finalPostData);
            })
            .then(newPost => {
                alert("Post successful!");
                if (newPost && newPost.id) {
                    navigate(`/posts/${newPost.id}`);
                } else {
                    navigate('/forum');
                }
            })
            .catch(err => {
                console.error("Post Error:", err);
                setError("Could not publish post. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div id="new-post-page-wrapper">
            <div className="post-form-card">
                <header className="form-header">
                    <h2>New Post in <span className="cat-label">{form.category}</span></h2>
                    {error && <p className="error-text">{error}</p>}
                </header>

                <form id="forum-submission-form" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label>Post Title</label>
                        <input 
                            name="title" 
                            type="text"
                            placeholder="Give your post a title..."
                            value={form.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <label>Upload Image (Optional)</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className="field-group">
                        <label>Content</label>
                        <textarea 
                            name="body"
                            placeholder="Share your thoughts or tips..."
                            value={form.body}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="publish-btn"
                        disabled={loading || isInvalid}
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPostForm;