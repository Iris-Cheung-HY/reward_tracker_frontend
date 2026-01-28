import { useState, useEffect } from 'react';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import axios from 'axios';

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const getFeaturePostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts/featured`)
  .then(response => response.data)
  .catch(error => console.log(error));
  }

const convertFeaturePostsFromAPI = (apiPost) => {
  const newPost = {
    ...apiPost,
    createdAt: apiPost.created_at ? apiPost.created_at : null,
    imageUrl: apiPost.image_url ? apiPost.image_url : null,
    isFeatured: apiPost.is_featured ? true : false,
    userId: apiPost.user_id ? apiPost.user_id : null,
  };
  delete newPost.created_at;
  delete newPost.image_url;
  delete newPost.is_featured;
  delete newPost.user_id;

  return newPost;
}

const getTravelCategoryPostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts?category=Travel`)
  .then(response => response.data)
  .catch(error => console.log(error))
}

const getCreditCardCategoryPostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts?category=Credit%20Card`)
  .then(response => response.data)
  .catch(error => console.log(error))
}


const App: React.FC = () => {

  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [travelPosts, setTravelPosts] = useState<any[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<any[]>([]);

  const getFirstThreeFeaturedPosts = () => {
    return getFeaturePostsAPI()
      .then(posts => {
        const newPosts = posts.map(convertFeaturePostsFromAPI);
        
        const sortedPosts = newPosts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

        const firstThree = sortedPosts.slice(0,3);
        setFeaturedPosts(firstThree)
      });
  };


  useEffect(() => {
    getFirstThreeFeaturedPosts();

  },[]);

  return (
    <>
      <Navbar/>
      <div className="feature-post-session">
        <h1> Featured Posts </h1>
        <div className="feature-post-container">
          {featuredPosts.map((post) => (
          <div key={post.id}>
            <a href={`/posts/${post.id}`}>
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} />
              ) : (
                <div>No Image</div>
              )}
            </a>
          </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App
