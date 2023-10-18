import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContextProvider } from './components/AuthContext';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import NewCourse from './pages/NewCourse';
import NewSet from './pages/NewSet';

function App() {

  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar/>
        <Routes>
          <Route path='/signin' element= {<SignIn />}/>
          <Route path='/' element= {<Home />}/>
          <Route path='/register-account' element= {<Register />}/>
        </Routes>
        


      </AuthContextProvider>
          
    </div>
  );
}

export default App;
