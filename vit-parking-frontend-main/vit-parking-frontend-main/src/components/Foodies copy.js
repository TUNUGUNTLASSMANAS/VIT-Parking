import { React, useEffect, useState } from "react";
import "./bootstrap.css";
import "./style.css";
import "@fontsource/noto-sans";
import Badge from "react-bootstrap/Badge";
import { Link, useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Login } from "./Login";
const Temp = (userID) => {
  const [array, setArray] = useState([]);
  const navigate = useNavigate();
  const [CurrentBooking, setBookingCount] = useState(-1);
  const [PrevBooking, setprevbooking] = useState(-1);
  const [PrevBookingTime, setprevbookingtime] = useState(-1);
  const [PrevBookingTime1, setprevbookingtime1] = useState(-1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  // console.log("Running.... ");
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
        const response = await fetch("https://vit-parking-backend.vercel.app/foodies");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();
        const temp = data.map((obj) => ({
          ...obj,
          className: obj.isBooked
            ? "boxstyling-not-available"
            : "boxstyling-available",
        }));
        setArray(temp);
      // console.log("Fetched Successfully", isLoggedIn);
        if (token) {
          const userString = localStorage.getItem("user");
          const user = JSON.parse(userString);
          const username = user.username;
          for (let i = 0; i < temp.length; i++) {
            // console.log(temp[i].PersonBooked === username);
            if (temp[i].PersonBooked === username) {
              setprevbooking(i);
              setprevbookingtime(temp[i].BookedDuration);
              // console.log(PrevBooking);
            }
          }
        }
      } catch (error) {
      // console.log("Error Loading");
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async () => {
    setprevbooking(CurrentBooking);
    if (!isLoggedIn) navigate("/login", { state: { returnPath: "/foodies" } });
    else {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      const username = user.username;
      const currentTime = new Date();
      try {
        const response = await fetch(
          "https://vit-parking-backend.vercel.app/updateBookingFoodies",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: array[CurrentBooking]._id,
              userId: username,
              time: new Date(currentTime.getTime() + PrevBookingTime1 * 60000)
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

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
        window.location.reload(); // Refresh page after 5 seconds
      }, 1000);
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row mt-2">
          {array.slice(0, 1).map((item, index) => (
            <div
              key={index}
              id={index}
              className={`ms-4 col-1 ${item.className}`}
              onClick={item.isBooked ? null : () => setBookingCount(index)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
          {array.slice(1, 10).map((item, index) => (
            <div
              key={index}
              id={index}
              className={`col-1 ${item.className}`}
              onClick={item.isBooked ? null : () => setBookingCount(index + 1)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
        </div>
        <div className="row mt-5 pt-5">
          {array.slice(10, 11).map((item, index) => (
            <div
              key={index}
              id={index}
              className={`ms-4 col-1 ${item.className}`}
              onClick={item.isBooked ? null : () => setBookingCount(index + 10)}
            >
              {item.isBooked ? "Not Available" : "Available"}
            </div>
          ))}
          {array.slice(11, 20).map((item, index) => (
            <div
              key={index}
              id={index + 10}
              className={`col-1 ${item.className}`}
              onClick={item.isBooked ? null : () => setBookingCount(index + 11)}
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
                    <option value={150}>3 hours</option>
                    <option value={60}>4 hours</option>
                    <option value={60}>5 hours</option>
                    <option value={60}>6 hours</option>
                    <option value={60}>7 hours</option>
                    <option value={150}>more than 7hours(20hrs maximum)</option>
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
              Your Booking is Succesfull for SLOT NUMBER: {PrevBooking} till {" "} 
              {PrevBookingTime == 70
                ? "more than an Hour"
                : PrevBookingTime + "mins"}
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
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=12.969584637468847,%2079.15869334935262+(VIT%20VELLORE%20SJT)&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
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


// import { React, useEffect, useState } from "react";
// import "./bootstrap.css";
// import "./style.css";
// import "@fontsource/noto-sans";
// import Badge from 'react-bootstrap/Badge';
// import { Link } from "react-router-dom";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// const Temp = (userID) => {
//   const [array, setArray] = useState([]);
//   const [Temp1, setTemp] = useState([]);
//   const [Temp1, setTemp] = useState([]);
//   const [prev, setprev] = useState(-1);
//   const [CountBooking, setBookingCount] = useState(0);
//   const [TimeSlot, setTimeSlot] = useState(-1);
//   const [PrevBooking, setPrevBooking] = useState(-1);
//   const [PrevBookingTime, setPrevTime] = useState(-1);

//   useEffect(() => {
//     const tempArray = [];
//     for (let i = 0; i < 20; i++) {
//       let temp1 = Math.floor(Math.random() * 10);
//       // console.log(temp1);
//       if (temp1 % 2) {
//         document.getElementById(i).style.backgroundColor = "grey";
//         document.getElementById(i).style.outline = "3.5px solid grey";
//         document.getElementById(i).style.cursor = "not-allowed";
//         // document.getElementById(i).hover="blocked";
//       }
//       tempArray.push(temp1 % 2);
//     }
//     setArray(tempArray);
//   }, []);
//   const handlehover1 = (e, f) => {
//     if (array[e] === 0) {
//       if (f) {
//         document.getElementById(e).style.backgroundColor = "greenyellow";
//         document.getElementById(e).style.color = "black";
//         document.getElementById(e).style.fontWeight = "bold";
//       } else {
//         document.getElementById(e).style.backgroundColor = "";
//         document.getElementById(e).style.color = "";
//         document.getElementById(e).style.fontWeight = "";
//       }
//     }
//   };
//   const handleClick1 = (e) => {
//     // console.log("ghggh");
//     if (!array[e]) {
//       setprev(e);
//     }
//   };
// const handleBooking = async () => {
//     let e = prev;
//     let temp2 = array;
//     temp2[e] = 1;
//     setArray(temp2);
//     setPrevTime(TimeSlot);
//     setTimeSlot(-1);
//     setPrevBooking(prev);
//     setprev(-1);
//     document.getElementById(e).style.backgroundColor = "grey";
//     document.getElementById(e).style.outline = "3.5px solid grey";
//     document.getElementById(e).style.cursor = "not-allowed";
//     document.getElementById(e).style.color = "";
//     document.getElementById(e).style.fontWeight = "";
//     document.getElementById(e).innerHTML = "Not Available";
//     document.getElementById("BookingHistory").hidden=false;
//     const newBookingContent = (
//         <div className="row mb-2" id={"Cancel"+e}>
//           <div className="col-10">
//           <div className="text-white text-start fs-4">{"Slot "+(e+1)}</div>
//               </div>
//               <div className="col-2">
//               <button className="btn btn-danger" onClick={()=>handleCancel(e)}>Cancel</button>
//               </div>
//           </div>
//     );
//     // setBookingCount(CountBooking+1); Changing them is taking time
//     setTemp([...Temp1, newBookingContent]);
// };
// const handleCancel = async (e) => {
//     document.getElementById('Cancel'+e).remove();
//     // setBookingCount(CountBooking-1); Changing them is taking time
//     let temp2 = array;
//     temp2[e] = 0;
//     setArray(temp2);
//     document.getElementById(e).style.outline = "3.5px solid greenyellow";
//     document.getElementById(e).style.backgroundColor = "black";
//     document.getElementById(e).style.cursor = "pointer";
//     setprev(-1);
//     setPrevBooking(-1);
// }
//   return (
//     <>
//       <div className="container-fluid">
//         <div className="row mt-2">
//           <div
//             id="0"
//             className="ms-4 col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(0, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(0, 1);
//             }}
//             onClick={() => {
//               handleClick1(0);
//             }}
//           >
//             {array[0] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="1"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(1, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(1, 1);
//             }}
//             onClick={() => {
//               handleClick1(1);
//             }}
//           >
//             {array[1] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="2"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(2, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(2, 1);
//             }}
//             onClick={() => {
//               handleClick1(2);
//             }}
//           >
//             {array[2] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="3"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(3, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(3, 1);
//             }}
//             onClick={() => {
//               handleClick1(3);
//             }}
//           >
//             {array[3] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="4"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(4, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(4, 1);
//             }}
//             onClick={() => {
//               handleClick1(4);
//             }}
//           >
//             {array[4] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="5"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(5, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(5, 1);
//             }}
//             onClick={() => {
//               handleClick1(5);
//             }}
//           >
//             {array[5] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="6"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(6, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(6, 1);
//             }}
//             onClick={() => {
//               handleClick1(6);
//             }}
//           >
//             {array[6] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="7"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(7, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(7, 1);
//             }}
//             onClick={() => {
//               handleClick1(7);
//             }}
//           >
//             {array[7] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="8"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(8, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(8, 1);
//             }}
//             onClick={() => {
//               handleClick1(8);
//             }}
//           >
//             {array[8] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="9"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(9, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(9, 1);
//             }}
//             onClick={() => {
//               handleClick1(9);
//             }}
//           >
//             {array[9] === 0 ? "Available" : "Not Available"}
//           </div>
//         </div>
//         <div className="row mt-5 pt-5">
//           <div
//             id="10"
//             className="ms-4 col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(10, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(10, 1);
//             }}
//             onClick={() => {
//               handleClick1(10);
//             }}
//           >
//             {array[10] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="11"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(11, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(11, 1);
//             }}
//             onClick={() => {
//               handleClick1(11);
//             }}
//           >
//             {array[11] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="12"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(12, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(12, 1);
//             }}
//             onClick={() => {
//               handleClick1(12);
//             }}
//           >
//             {array[12] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="13"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(13, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(13, 1);
//             }}
//             onClick={() => {
//               handleClick1(13);
//             }}
//           >
//             {array[13] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="14"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(14, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(14, 1);
//             }}
//             onClick={() => {
//               handleClick1(14);
//             }}
//           >
//             {array[14] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="15"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(15, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(15, 1);
//             }}
//             onClick={() => {
//               handleClick1(15);
//             }}
//           >
//             {array[15] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="16"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(16, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(16, 1);
//             }}
//             onClick={() => {
//               handleClick1(16);
//             }}
//           >
//             {array[16] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="17"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(17, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(17, 1);
//             }}
//             onClick={() => {
//               handleClick1(17);
//             }}
//           >
//             {array[17] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="18"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(18, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(18, 1);
//             }}
//             onClick={() => {
//               handleClick1(18);
//             }}
//           >
//             {array[18] === 0 ? "Available" : "Not Available"}
//           </div>
//           <div
//             id="19"
//             className="col-1 boxstyling"
//             onMouseLeave={() => {
//               handlehover1(19, 0);
//             }}
//             onMouseOver={() => {
//               handlehover1(19, 1);
//             }}
//             onClick={() => {
//               handleClick1(19);
//             }}
//           >
//             {array[19] === 0 ? "Available" : "Not Available"}
//           </div>
//         </div>
//       </div>
//       {prev!=-1 && (<div className="container-fluid mt-5 pt-2 mb-3" style={{border:"3px solid white"}}>
//         <div className="row text-white">
//           <div className="col-12">
//             <div className="row">
//                 <div className="col-1">
//                     <button className="btn btn-primary">
//                         Slot <Badge bg="secondary">{prev+1}</Badge>
//                     </button>
//                 </div>
//                 <div className="col-3 pt-2 pb-4 fs-3 text-end fw-bold">Time Slot:</div>
//                 <div className="col-3 pt-3 pb-4">
//                     <select class="form-select" aria-label="Default select example" onChange={e=>setTimeSlot(e.target.value)}>
//                         <option selected value={-1}>Select Your Time Slot</option>
//                         <option value={10}>10 mins</option> 
//                         <option value={15}>15 mins</option>
//                         <option value={30}>30 mins</option>
//                         <option value={45}>45 mins</option>
//                         <option value={60}>1hr</option>
//                         <option value={70}>more than 1hr</option>
//                     </select>
//                 </div>
//                     <div className="col-2 pt-3">
//                         {TimeSlot!=-1 && (<button className="btn btn-primary" onClick={handleBooking}>Submit</button>)}
//                     </div>
//             </div>
//           </div>
//         </div>
//       </div>)}
//       {/* <div id="bottom"></div> */}
//       {PrevBooking!=-1 && (<div className="container-fluid mt-5 pt-2 mb-3" id="timeselection" style={{border:"3px solid green"}}>
//         <div className="row">
//             <div className="col-12 text-success fs-2 fw-bold text-center pt-2">Your Booking is Succesfull for SLOT NUMBER: {PrevBooking+1} for {(PrevBookingTime==70)?'more than an Hour':PrevBookingTime+'mins'}</div>
//             <div className="col-12 text-white fs-3 fw-bold ">
//                 Location:
//                 <div style={{width: "100%"}}><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=12.969584637468847,%2079.15869334935262+(VIT%20VELLORE%20SJT)&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps systems</a></iframe></div>
//             </div>
//         </div>
//       </div>)}
//       <div className='container-fluid mt-5 pt-2 mb-3' style={{border:"3px solid white"}} id="BookingHistory" hidden>
//             <div className="row">
//                 <div className="col-12 text-white">
//                 <h1>Previous Orders</h1>
//                 </div>
//             </div>
//             {Temp1}
//         </div>
//     </>
//   );
// };

// export default Temp;

// // import { useLocation } from "react-router-dom";

// // const MyComponent = (props) => {
// //   const location = useLocation();
// //   const { foo } = location.state || {};
  
// //   return (
// //     <div>
// //       {/* Use the props here */}
// //       <p>Foo: {foo}</p>
// //     </div>
// //   );
// // };

// // export default MyComponent;
