import './App.css';
import { useContext } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import { UserContext } from './UserContext'; // Import the context
import { UserProvider } from './UserContext'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyProfile from './components/MyProfile';

function App() {
  return (
    <UserProvider> {/* Wrap the entire app with UserProvider */}
      <Router>
        <div className="App">
          <UserContext.Consumer>
            {({ user }) => (
              <>
                <Navbar />
                <div className="main">
                  <div className="routes">
                    <Routes>
                      <Route exact path="/signup" element={<SignUp />} />
                      <Route exact path="/signin" element={<SignIn />} />
                      <Route exact path="/about-us" element={<AboutUs />} />
                      <Route exact path="/my-profile" element={<MyProfile />} />
                    </Routes>
                  </div>
                </div>
              </>
            )}
          </UserContext.Consumer>
        </div>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
