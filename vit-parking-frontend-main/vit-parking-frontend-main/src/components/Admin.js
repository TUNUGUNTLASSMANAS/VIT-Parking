import { useEffect, useState } from "react";
import "./bootstrap.css";
import "@fontsource/noto-sans";
import { Link, useNavigate } from "react-router-dom";
import { green, grey } from "@mui/material/colors";
const backend = "https://vit-parking-backend.vercel.app";
// const backend="http://127.0.0.1:5000";

const Temp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);  // New loading state
  const [isAvailable, setIsAvailable] = useState(-1);
  const [location, setLocation] = useState("");
  const [id, setId] = useState(-1);
  const [users, setUsers] = useState([]);
  const [AdminAccess, setAdminAccess] = useState(0);
  useEffect(() => {
      const fetchData = async () => {
        const loggedin = localStorage.getItem("token");
        // console.log(!loggedin);
        if (!loggedin) {
          navigate('/');
          return;
        }
        const userString = localStorage.getItem("user");
          const user = JSON.parse(userString);
          const username = user.username;
          if (username==="Guna_Nalam") setAdminAccess(1);
          const response = await fetch(backend + "/users");
          const data = await response.json();
          const filteredArr = data.filter(user => {
            return (user.username!="Guna_Nalam");
          });
          
          setUsers(filteredArr);
          setIsLoading(false);
      };
      fetchData();
    }, []);

  const checkavail = async () => {
    try {
      const response = await fetch(backend + "/checkavailability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: location,
          id: id-1,
        }),
      });
      const data = await response.json();
      console.log(data);
      setIsAvailable(data.Available);
    } catch (error) {
      console.error("Error updating booking:"+error);
    }
  };
  const renderSlotOptions = () => {
    let numberOfSlots = 20; // Default to 20 slots
    // Check location to determine the number of slots
    if (location === "SJT" || location === "TT") {
      numberOfSlots = 40;
    }
    // Generate slot options based on the number of slots
    const options = [];
    for (let i = 1; i <= numberOfSlots; i++) {
      options.push(
        <option key={i} value={i}>
          Slot {i}
        </option>
      );
    }
    return options;
  };
  const handlelocation = (location) => {
    setLocation(location);
    setIsAvailable(-1);
  };
  const handleslot = (id) => {
    setId(id);
    setIsAvailable(-1);
  };
  const updateAvailable = async () => {
    try {
      const response = await fetch(backend + "/changeavailibility", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: location,
          id: id-1,
        }),
      });

      // const data = await response.json();
      // console.log(data);
      // setIsAvailable(data.Available);
    } catch (error) {
      console.error("Error updating booking:"+error);
    }
  };
  const updateAdminStatus = async (userId, isAdmin) => {
    try {
      const response = await fetch(backend + `/users/${userId}/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error updating admin status: " + error);
    }
  };
  if (isLoading) {
    return (
      <div className="lds-facebook"><div></div><div></div><div></div></div>
    );
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center text-white fs-1 pb-3">
            <p>Welcome to Admin Page</p>
          </div>
          <div className="offset-3 col-3 pt-3 pb-4">
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e)=>handlelocation(e.target.value)}
            >
              <option selected value={""}>
                Select Location to view
              </option>
              <option value={"Foodies"}>Foodies</option>
              <option value={"SJT"}>SJT</option>
              <option value={"TT"}>TT</option>
              <option value={"MB"}>MB</option>
            </select>
          </div>
          {location !== "" && (
            <div className="col-2 pt-3 pb-4">
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e)=>handleslot(e.target.value)}
              >
                <option selected value={-1}>
                  Select your slot
                </option>
                {renderSlotOptions()}
              </select>
            </div>
          )}
          {id!=-1 && (
            <div className="col-3 pt-3 pb-4 text-white"> 
            <button className="btn btn-secondary" onClick={checkavail}>check</button>
            {isAvailable!=-1? (
              <span className={`ms-3 ${isAvailable?"text-success fs-5":"text-danger"}`}> {isAvailable ?"Available":"Not Available"}
              </span>):""}
            </div>
          )}
          {isAvailable==0 && (
            <div className="offset-5 col-3 pt-3 pb-4 text-white"> 
              <button className="btn btn-danger" onClick={updateAvailable}>Make it available</button>
            </div>
          )}
          {AdminAccess && (
            <div className="border offset-4 col-3 pt-3 pb-4 text-white">
              <h2>Users</h2>
              {users.map((user) => (
                <div key={user._id} className="pt-2 d-flex justify-content-between">
                  <span>{user.username}</span>
                  <button
                    className={`btn ${
                      user.isAdmin ? "btn-danger" : "btn-primary"
                    }`}
                    onClick={() =>
                      updateAdminStatus(user._id, !user.isAdmin)
                    }
                  >
                    {user.isAdmin ? "Remove Admin Access" : "Give Admin Access"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Temp;
