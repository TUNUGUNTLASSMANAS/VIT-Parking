import { useEffect, useState } from "react";
import "./bootstrap.css";
import "./style.css";
import "@fontsource/noto-sans";
import { Link, useNavigate } from "react-router-dom";

const Temp=()=>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, SetIsAdmin] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            const userString = localStorage.getItem("user");
            const user = JSON.parse(userString);
            if (user.isAdmin) SetIsAdmin(true); 
        }
      }, []);
    return (
        <div className="container-fluid">
            <div className="row text-white">
                <div className="col-2 mt-3">
                    {isAdmin ?<button className="btn btn-primary" onClick={()=>navigate('/admin')}>Admin</button>:""}
                </div>
                <div className="col-8 MainHeading">
                    Choose your Parking Destination
                </div>
                <div className="mt-3 offset-1 col-1">
                    <button className={isLoggedIn?"btn btn-danger":"btn btn-primary"} onClick={()=>{
                    if (isLoggedIn) {
                        if (!window.confirm("Are you sure you want to logout")) return; 
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            setIsLoggedIn(false);
                        } else navigate('/login');
                    }}> {isLoggedIn?"Logout":"Login"}</button></div>
                <Link  to= {"/foodies"} className="mt-2 offset-1 col-5 buttons links">FOODIES</Link>
                <Link  to= {"/sjt"} className="mt-2 col-5 buttons links">SJT</Link>
                <Link  to= {"/tt"} className="offset-1 col-5 buttons links">TT</Link>
                <Link  to= {"/mainbuilding"} className="col-5 buttons links mb-2">Main Parking</Link>
                <div className="offset-4 col-6" style={{paddingLeft:'125px', fontSize:'12px'}}>ALL RIGHTS RESERVED TM ® COPYRIGHT © 2024</div>
            </div>
        </div>
    )
}

export default Temp;