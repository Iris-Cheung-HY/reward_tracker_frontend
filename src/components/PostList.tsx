import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface PostItem {
    id: number;
    title: string;
    body: string;
    imageUrl?: string; 
    category?: string;
    authorName?: string;
    createdAt?: string;
}

interface PostListProps {
    title: string;
    categoryKey: string;
    isLoggedIn: boolean;
    posts: PostItem[];
}

const PostList: React.FC<PostListProps> = ({ title, categoryKey, isLoggedIn, posts }) => {
  const navigate = useNavigate();

  return (
    <div className={`${categoryKey.toLowerCase()}-post-container mb-4`}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <h2 className="fw-bold">{title}</h2> 
        
        {isLoggedIn && (
          <button 
            className="btn btn-sm btn-primary rounded-circle" 
            style={{ width: '30px', height: '30px' }}
            onClick={() => navigate(`/posts/new?category=${categoryKey}`)}
          >
            +
          </button>
        )}
      </div>
      
      {posts && posts.length > 0 ? (
        <div className="list-group list-group-flush">
          {posts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => navigate(`/posts/${post.id}`)} 
              className="list-group-item list-group-item-action border-0 ps-0"
              style={{ cursor: 'pointer', background: 'transparent' }}
            >
              <span className="post-link text-primary">• {post.title}</span>
              {post.createdAt && (
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted ps-3">No posts yet.</p>
      )}
    </div>
  );
};

export default PostList;