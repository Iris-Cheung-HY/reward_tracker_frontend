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
    <div className="h-100 p-3 bg-white rounded-4 shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h3 className="fw-bold mb-0 text-dark">
            <i className={`bi ${categoryKey === 'Travel' ? 'bi-airplane' : 'bi-credit-card'} me-2 text-primary`}></i>
            {title}
        </h3> 
        
        {isLoggedIn && (
          <button 
            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold" 
            onClick={() => navigate(`/posts/new?category=${categoryKey}`)}
          >
            <i className="bi bi-plus-lg me-1"></i> Post
          </button>
        )}
      </div>
      
      {posts && posts.length > 0 ? (
        <div className="vstack gap-2">
          {posts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => navigate(`/posts/${post.id}`)} 
              className="p-3 rounded-3 list-item-hover transition-all"
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="fw-semibold text-dark mb-1 h6 text-truncate">
                  {post.title}
                </div>
                {post.createdAt && (
                    <small className="text-muted text-nowrap ms-2" style={{ fontSize: '0.75rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                )}
              </div>
              <p className="text-muted small mb-0 text-truncate">
                {post.body.substring(0, 60)}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
            <i className="bi bi-chat-left-text text-light display-4"></i>
            <p className="text-muted mt-2">No posts in {title} yet.</p>
        </div>
      )}

      <style>{`
        .list-item-hover:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PostList;