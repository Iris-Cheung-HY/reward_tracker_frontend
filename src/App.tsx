import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import axios from 'axios';
import Forum from './pages/Forum';
import Summary from './pages/Summary';
import CardDetail from './pages/CardDetail';


const App: React.FC = () => {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path ="/" element={<Forum />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/card/:cardId" element={<CardDetail />} />
        </Routes>
      </Router>
    </>

  );
};

export default App;