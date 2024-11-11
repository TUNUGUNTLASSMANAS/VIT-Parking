// import './App.css';
import ParkingVIT from './components/ParkingVIT';
import Foodies from './components/Foodies';
import Maps from './components/Maps';
import Load from './components/Load';
import MB from './components/MB';
import SJT from './components/SJT';
import TT from './components/TT';
import Admin from './components/Admin.js';
import Login from './components/Login';
import Signup from './components/Signup.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//Backend-MiniProject...
function App() {
  return (
    <>
      <Load />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<ParkingVIT/>} />
        <Route path="/foodies" element={<Foodies />} />
        <Route path="/tt" element={<TT />} />
        <Route path="/sjt" element={<SJT />} />
        <Route path="/mainbuilding" element={<MB/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/admin" element={<Admin/>} />
        </ Routes>
      </ BrowserRouter>
      </>
  );
}

export default App;
