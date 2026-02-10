import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import type { FrontendPost } from '../types/PostType';

interface Props {
  posts: FrontendPost[];
}

function FeaturedPost({ posts }: Props) {
  const navigate = useNavigate();

  return (
    <Carousel 
      fade 
      className="custom-featured-carousel" 
      interval={5000}
      indicators={true}
    >
      {posts.slice(0, 3).map((post) => (
        <Carousel.Item 
          key={post.id} 
          onClick={() => navigate(`/posts/${post.id}`)}
          className="carousel-item-wrapper"
        >
          <img
            className="d-block w-100 featured-image"
            src={post.imageUrl}
            alt={post.title}
          />
          <Carousel.Caption className="featured-content-overlay">
            <h2 className="featured-title">{post.title}</h2>
            <p className="featured-description d-none d-md-block">
              {post.body.substring(0, 100)}...
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default FeaturedPost;