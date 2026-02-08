import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const kDefaultPostForm = {
    title: '',
    body: '',
    category: 'Travel' 
};

const NewPostForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [postFormData, setPostFormData] = useState(kDefaultPostForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [posts, setPosts] = useState([]);
    
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [errMsg, setErrMsg] = useState('Message cannot be empty!');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) {
            setPostFormData(prev => ({ ...prev, category: cat }));
        }
    }, [location.search]);

    const updateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        const newFormData = {
            ...postFormData,
            [name]: value
        };
        setPostFormData(newFormData);

        if (newFormData.title.trim().length === 0 || newFormData.body.trim().length === 0) {
            setDisableSubmit(true);
            setErrMsg('Title and Content cannot be empty!');
        } else {
            setDisableSubmit(false);
            setErrMsg('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);


        setPostFormData(kDefaultPostForm);

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
                ...postFormData,
                imageUrl: imageUrl,
                user_id: currentUserId
            };

            const res = await axios.post(`${backendUrl}/posts`, postData);

            alert("Post Success！");

            const newPost = res.data
            if (newPost && newPost.id) {
                navigate(`/posts/${newPost.id}`)
            } else {
                navigate('/forum')
            }
        } catch (error) {
            console.error(error);
            alert("Please try again later!");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '100px', maxWidth: '600px' }}>
            <h2>New Post in <span className="text-primary">{postFormData.category}</span></h2>
            
            <form onSubmit={handleSubmit}>
                {errMsg && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errMsg}</p>}

                <input 
                    name="title"
                    className="form-control mb-3" 
                    placeholder="Title" 
                    value={postFormData.title}
                    onChange={updateFormChange}
                    required 
                />
                
                <input 
                    type="file" 
                    className="form-control mb-3" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />

                <textarea 
                    name="body"
                    className="form-control mb-3" 
                    placeholder="Content" 
                    value={postFormData.body} 
                    style={{ height: '200px' }}
                    onChange={updateFormChange}
                    required 
                />              
                
                <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    disabled={isUploading || disableSubmit}
                >
                    {isUploading ? "Uploading..." : "Publish Post"}
                </button>
            </form>
        </div>
    );
};

export default NewPostForm;