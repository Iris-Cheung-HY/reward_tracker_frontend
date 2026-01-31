import { useState, useEffect } from 'react';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import axios from 'axios';
import FeaturedPost from './components/FeaturedPost';
import type { FrontendPost } from './types/PostType';


const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const getFeaturePostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts/featured`)
  .then(response => response.data)
  .catch(error => console.log(error));
  }

const convertFeaturePostsFromAPI = (apiPost: FrontendPost) => {
  const newPost = {
    ...apiPost,
  };
  return newPost;
}

const getTravelCategoryPreviewPostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts/travel-preview`)
  .then(response => response.data)
  .catch(error => console.log(error))
}

const convertTravelCategoryPreviewPostsAPI = (apiPost: FrontendPost) => {
  const newTravelCatPosts = {
    ...apiPost,
  };
  return newTravelCatPosts;
}

const getCreditCardCategoryPreviewPostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts/creditcard-preview`)
  .then(response => response.data)
  .catch(error => console.log(error))
}

const convertCreditCardCategoryPreviewPostsAPI = (apiPost: FrontendPost) => {
  const newCreditCardCatPosts = {
    ...apiPost,
  };
  return newCreditCardCatPosts;
}


const App: React.FC = () => {

  const [featuredPosts, setFeaturedPosts] = useState<FrontendPost[]>([]);
  const [travelPosts, setTravelPosts] = useState<FrontendPost[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<FrontendPost[]>([]);

  const getFirstThreeFeaturedPosts = () => {
    return getFeaturePostsAPI()
      .then(response => {
        const newPosts = response.content.map(convertFeaturePostsFromAPI);
        setFeaturedPosts(newPosts);
      });
  };

  const getTravelCatPosts = () => {
    return getTravelCategoryPreviewPostsAPI()
      .then(response => {
        const newTravelPosts = response.content.map(convertTravelCategoryPreviewPostsAPI);
        setTravelPosts(newTravelPosts);
      })
  }

  const getCreditCardPosts = () => {
    return getCreditCardCategoryPreviewPostsAPI()
      .then(response => {
        const newCreditCardPosts = response.content.map(convertCreditCardCategoryPreviewPostsAPI);
        setCreditCardPosts(newCreditCardPosts)

      })
  }


  useEffect(() => {
    getFirstThreeFeaturedPosts();
    getTravelCatPosts();
    getCreditCardPosts();

  },[]);

  return (
    <>
      <Navbar />
      <div className="all-session">
        <div className="feature-post-session">
          <h1>Featured Posts</h1>
          <FeaturedPost posts = {featuredPosts}/>
        </div>
      <div className="sub-session">
        <div className="travel-post-container">
          <h1>Travel</h1>
          <button>+</button>
          {travelPosts.map((post) => (
            <div key={post.id}>
              <ul>{post.title}</ul>
            </div>
          ))}
        </div>

        <div className="credit-card-post-container">
          <h1>Credit Card</h1>
          <button>+</button>
          {creditCardPosts.map((post) => (
            <div key={post.id}>
              <ul>{post.title}</ul>
            </div>
          ))}
        </div>
        
        
      
      
      
      
      </div>     
      </div>
    </>
  )
  };


export default App
