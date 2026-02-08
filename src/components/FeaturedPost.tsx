import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import type { FrontendPost } from '../types/PostType';

interface Props {
  posts: FrontendPost[];
}

function FeaturedPost({ posts }: Props) {
  const navigate = useNavigate();


  if (!posts || posts.length === 0) return null;

  return (
    <Carousel 
      fade 
      className="shadow-lg rounded-4 overflow-hidden mb-5"

      interval={5000} 
    >
      {posts.slice(0, 3).map((post) => (
        <Carousel.Item 
          key={post.postId || post.id} 
          onClick={() => navigate(`/posts/${post.postId || post.id}`)}
          style={{ cursor: 'pointer', height: '450px' }}
        >
          <img
            className="d-block w-100 h-100"
            src={post.postImage || post.imageUrl}
            alt={post.title}
            style={{ objectFit: 'cover' }} 
          />
          
          <Carousel.Caption 
            className="text-start px-4"
            style={{ 
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              left: 0,
              right: 0,
              bottom: 0,
              paddingBottom: '2rem'
            }}
          >
            <h2 className="fw-bold text-white">{post.title}</h2>
            <p className="text-light d-none d-md-block">
              {post.content ? `${post.content.substring(0, 120)}...` : "Click to read more"}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default FeaturedPost;