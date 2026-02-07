import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export interface PostDetails {
    id: number;
    title: string;
    body: string;
    imageUrl: string; 
    category: string;
    authorName?: string; 
}

const PostDetail: React.FC = () => {
    const { id } = useParams();
    const [post, setPost] = useState<PostDetails | null>(null);

    useEffect(() => {
        axios.get(`${backendUrl}/posts/${id}`)
            .then(res => setPost(res.data))
            .catch(err => console.error("Fetch post error:", err));
    }, [id]);

    if (!post) return <div className="text-center" style={{marginTop: '100px'}}>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '100px', maxWidth: '800px' }}>
            <h1 className="fw-bold">{post.title}</h1>
            <div className="d-flex gap-2 mb-4">
                <span className="badge bg-info">{post.category}</span>
                <small className="text-muted">Posted by {post.authorName || 'Anonymous'}</small>
            </div>

            {post.imageUrl && (
                <div className="text-center mb-4">
                    <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}

            <div 
                className="post-body p-3 bg-white rounded border"
                style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem' }}
            >
                {post.body}
            </div>
            
            <button className="btn btn-outline-secondary mt-5" onClick={() => window.history.back()}>
                ← Back to Forum
            </button>
        </div>
    );
};

export default PostDetail;