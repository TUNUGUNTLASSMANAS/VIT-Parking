import { React, useEffect, useState } from "react";
import "./bootstrap.css";
import "./style.css";
import "@fontsource/noto-sans";
import Badge from "react-bootstrap/Badge";
import { Link, useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Login } from "./Login";
const backend="https://vit-parking-backend.vercel.app";
// const backend="http://127.0.0.1:5000";
const Temp = (userID) => {
  const [array, setArray] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [CurrentBooking, setBookingCount] = useState(-1);
  const [PrevBooking, setprevbooking] = useState(-1);
  const [PrevBookArray, setprevArray] = useState([]);
  const [PrevBookingTime, setprevbookingtime] = useState(-1);
  const [PrevBookingTime1, setprevbookingtime1] = useState(-1);
  const [BookingTill, settill] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
      // console.log("Running.... tt");
        const token = localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
        const response = await fetch(backend+"/tt");
        if (!response.ok) {
        // console.log("Fetching Not Successfully", );
          throw new Error("Network response was not ok");
          return;
        }
      // console.log("Fetching Successfully");
        // console.log(process.env.backend);
      // console.log(response);
        let data = await response.json();
        const temp = data.map((obj) => ({
          ...obj,
        }));
        setArray(data);
      // console.log("Fetched Successfully", isLoggedIn);
        if (token) {
          const userString = localStorage.getItem("user");
          const user = JSON.parse(userString);
          const username = user.username;
          let latest=-1;
          for (let i = 0; i < temp.length; i++) {
            // console.log(temp[i].PersonBooked === username);
            if (temp[i].isBooked && temp[i].PersonBooked === username) {
              if (latest==-1 || temp[i].Duration-temp[i].BookedDuration*60000>latest) { //recent fetching
                setprevbooking(i);
                setprevbookingtime(temp[i].BookedDuration);
                settill(temp[i].BookedTill);
                latest=temp[i].Duration-temp[i].BookedDuration*60000;
              }
              // console.log(PrevBooking);
            }
          }
        }
      } catch (error) {
      // console.log("Error Loading");
      }finally {
        setIsLoading(false);  // Set loading to false after fetching
      }
    };
    fetchData();
  }, []);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleactive = (index) => {
    setActiveIndex(index);
    setBookingCount(index);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to book the slot?")) return; 
    if (!isLoggedIn) navigate("/login", { state: { returnPath: "/tt" } });
    else {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      const username = user.username;
      // const currentTime = new Date().getTime();
      let currentTime = new Date(new Date().getTime()+PrevBookingTime1*60000);
      let currentTime1=currentTime.toString();
      currentTime=currentTime.getTime();
      // console.log(new Date(currentTime.getTime()+PrevBookingTime1*60000));
      // console.log(currentTime.getTime());
      try {
        const response = await fetch(
          backend+"/updateBookingtt",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: array[CurrentBooking]._id,
              userId: username,
              Dur: PrevBookingTime1,
              time: currentTime1,
              Duration: currentTime
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          alert(data.message);
          return;
        }
        
        setprevbooking(CurrentBooking);
        const data = await response.json();
        // console.log(data.message);
        // Update local state if needed
        const updatedArray = [...array];
        updatedArray[CurrentBooking].isBooked = 1;
        setArray(updatedArray);
        // console.log(updatedArray);
        setprevbooking(CurrentBooking);
      } catch (error) {
        console.error("Error updating booking:");
      }
      setTimeout(() => {
        window.location.reload(); // Refresh page after 1 seconds
      }, 100);
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
        <div className="row sub-headings">
          <div className="col-1"><button className="btn btn-dark" onClick={()=>navigate('/')}>Back</button></div>
          <div className="offset-2 col-6"><p>Technology Tower</p></div>
          <div className="offset-2 col-1"><button className={isLoggedIn?"btn btn-danger":"btn btn-primary"} onClick={()=>{
            if (isLoggedIn) {
              if (!window.confirm("Are you sure you want to logout")) return; 
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setIsLoggedIn(false);
            } else navigate('/login');
          }}> {isLoggedIn?"Logout":"Login"}</button></div>
        </div>
        <div className="row mt-2">
          {array.slice(0, 1).map((item, index) => (
            <div
              key={index}
              id={index}
              className={`ms-4 col-1 ${item.isBooked
                ? "boxstyling-not-available"
                : activeIndex === index
                ? "boxstyling"
                : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
          {array.slice(1, 10).map((item, index) => (
            <div
              key={index+1}
              id={index+1}
              className={`col-1 ${item.isBooked
              ? "boxstyling-not-available"
              : activeIndex === index+1
              ? "boxstyling"
              : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index + 1)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
        </div>
        <div className="row mt-4 border py-5 mx-2">
          <div className="ms-4 col-1 bg-white text-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white text-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          {/* <div className="ms-5 col-1 bg-white text-white">ff</div> */}
        </div>
        <div className="row mt-4">
          {array.slice(10, 11).map((item, index) => (
            <div
              key={index+10}
              id={index+10}
              className={`ms-4 col-1 ${item.isBooked
              ? "boxstyling-not-available"
              : activeIndex === index+10
              ? "boxstyling"
              : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index + 10)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
          {array.slice(11, 20).map((item, index) => (
            <div
              key={index+11}
              id={index + 11}
              className={`col-1 ${item.isBooked
              ? "boxstyling-not-available"
              : activeIndex === index+11
              ? "boxstyling"
              : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index + 11)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
        </div>
        <div className="row mt-3">
          {array.slice(20, 21).map((item, index) => (
            <div
              key={index+20}
              id={index+20}
              className={`ms-4 col-1 ${item.isBooked
                ? "boxstyling-not-available"
                : activeIndex === index+20
                ? "boxstyling"
                : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index+20)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
          {array.slice(21, 30).map((item, index) => (
            <div
              key={index+21}
              id={index+21}
              className={`col-1 ${item.isBooked
              ? "boxstyling-not-available"
              : activeIndex === index+21
              ? "boxstyling"
              : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index + 21)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
        </div>
        <div className="row mt-4 border py-5 mx-2">
          <div className="ms-4 col-1 bg-white text-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white text-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          <div className="ms-5 me-3 col-1 p-1 bg-white"></div>
          {/* <div className="ms-5 col-1 bg-white text-white">ff</div> */}
        </div>
        <div className="row mt-4">
          {array.slice(30, 31).map((item, index) => (
            <div
              key={index+30}
              id={index+30}
              className={`ms-4 col-1 ${item.isBooked
              ? "boxstyling-not-available"
              : activeIndex === index+30
              ? "boxstyling"
              : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index + 30)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
          {array.slice(31, 40).map((item, index) => (
            <div
              key={index+31}
              id={index + 31}
              className={`col-1 ${item.isBooked
              ? "boxstyling-not-available"
              : activeIndex === index+31
              ? "boxstyling"
              : "boxstyling-available"}`}
              onClick={item.isBooked ? null : () => handleactive(index + 31)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
        </div>
      </div>
      {CurrentBooking != -1 && (
        <div
          className="container-fluid mt-5 pt-2 mb-3"
          style={{ border: "3px solid white" }}
        >
          <div className="row text-white">
            <div className="col-12">
              <div className="row">
                <div className="col-1">
                  <button className="btn btn-primary">
                    Slot <Badge bg="secondary">{CurrentBooking + 1}</Badge>
                  </button>
                </div>
                <div className="col-3 pt-2 pb-4 fs-3 text-end fw-bold">
                  Time Slot:
                </div>
                <div className="col-3 pt-3 pb-4">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    onChange={(e) => setprevbookingtime1(e.target.value)}
                  >
                    <option selected value={-1}>
                      Select Your Time Slot
                    </option>
                    <option value={10}>10 mins</option>
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>1 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={300}>5 hours</option>
                    <option value={360}>6 hours</option>
                    <option value={420}>7 hours</option>
                    <option value={1000}>Till I take</option>
                  </select>
                </div>
                <div className="col-2 pt-3">
                  {PrevBookingTime1 != -1 && (
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {PrevBooking != -1 && (
        <div
          className="container-fluid mt-5 pt-2 mb-3"
          id="timeselection"
          style={{ border: "3px solid green" }}
        >
          <div className="row">
            <div className="col-12 text-success fs-2 fw-bold text-center pt-2">
              Your Booking was Succesfull for SLOT NUMBER: {PrevBooking+1} 
              {PrevBookingTime>420 ?
                ""
                :" till "+BookingTill.substring(4,21)
              } 
            </div>
            <div className="col-12 text-white fs-3 fw-bold ">
              Location:
              <div style={{ width: "100%" }}>
                <iframe
                  width="100%"
                  height="600"
                  frameborder="0"
                  scrolling="no"
                  marginheight="0"
                  marginwidth="0"
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=12.970712994085087,%2079.16007472688032+(VIT%20VELLORE%20SJT)&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                >
                  <a href="https://www.gps.ie/">gps systems</a>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Temp;
