import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="main">
          <div className="routes">
            <Routes>
              <Route exact path="/signup" element={<SignUp />} />
              <Route exact path="/signin" element={<SignIn />} />
              <Route exact path="/about-us" element={<AboutUs />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer/>
    </Router>
    
  );
}

export default App;