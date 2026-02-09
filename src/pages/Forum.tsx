import { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedPost from '../components/FeaturedPost';
import PostList from '../components/PostList';
import type { FrontendPost } from '../types/PostType';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const Forum: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<FrontendPost[]>([]);
  const [travelPosts, setTravelPosts] = useState<FrontendPost[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<FrontendPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const savedUser = localStorage.getItem('user');
  const isLoggedIn = !!savedUser;

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      const fetchPosts = async (endpoint: string) => {
        try {
          const response = await axios.get(`${backendUrl}${endpoint}`);
          return response.data.content || response.data || [];
        } catch (error) {
          console.error(error);
          return [];
        }
      };
      
      const [featured, travel, credit] = await Promise.all([
        fetchPosts('/posts/featured'),
        fetchPosts('/posts/travel-preview'),
        fetchPosts('/posts/creditcard-preview')
      ]);

      setFeaturedPosts(featured);
      setTravelPosts(travel);
      setCreditCardPosts(credit);
      setIsLoading(false);
    };
    loadAllData();
  }, []);

  if (isLoading) return <div className="text-center mt-5">Loading posts...</div>;

    return (

    <div className="container-fluid py-5" style={{ maxWidth: '1400px', marginTop: '80px' }}>
        

        <section className="mb-5 px-md-3">
        <h2 className="fw-bold mb-4">Featured Posts</h2>
        <FeaturedPost posts={featuredPosts} />
        </section>

        <div className="row g-4 px-md-3">
        <div className="col-lg-6">
            <PostList 
            title="Travel" 
            posts={travelPosts} 
            categoryKey="Travel" 
            isLoggedIn={isLoggedIn} 
            />
        </div>
        
        <div className="col-lg-6">
            <PostList 
            title="Credit Card" 
            posts={creditCardPosts} 
            categoryKey="Credit Card" 
            isLoggedIn={isLoggedIn} 
            />
        </div>
        </div>
    </div>
    );
}

export default Forum;