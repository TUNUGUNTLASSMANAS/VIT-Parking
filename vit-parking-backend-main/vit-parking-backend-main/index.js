const express = require("express");
require("dotenv").config();
require("./Database/Config.js");
const cors = require("cors");
const User = require("./Database/User.js");
const Foodies = require("./Database/Foodies.js");
const SJT = require("./Database/SJT.js");
const TT = require("./Database/TT.js");
const MB = require("./Database/MB.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const crypto = require('crypto');
// const { loadEnvFile } = require("process");

app.use(express.json());
const corsOptions = {
  origin: '*', // Replace with your frontend URL
  credentials: true
};
app.use(cors(corsOptions));
// app.use(cors());


const jwtSecret = crypto.randomBytes(32).toString('hex');
app.post("/signup", async (req, resp) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return resp.status(400).send("Username or Email already exists");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin=false;
    user = new User({ username, email, password: hashedPassword , isAdmin});
    let result = await user.save();
    result = result.toObject();
    
    const token = jwt.sign({ userId: user.username }, jwtSecret, { expiresIn: "1h" });
    
    resp.status(201).send({result, token});
  } catch (error) {
    resp.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, resp) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user) {
    return resp.status(400).send("Invalid username or password");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return resp.status(400).send("Invalid username or password");
  }
  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
  resp.send({ token, user });
});

// Assuming you have a route to fetch user details based on the token
app.get("/foodies", async (req, res) => {
  try {
    const user = await Foodies.find({});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentTime = new Date().getTime();
    const updatedUsers = user.map(user => {
      if (user.isBooked && user.BookedDuration!=1000 && user.Duration < currentTime) {
        user.isBooked = false; // Update isBooked to false if the booking has expired
      }
      return user;
    });
    res.status(200).json(updatedUsers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/checkavailability", async (req, res) => {
  const {location, id}=req.body;
  try {
    let user;
    // console.log(location,id);
    if (location==="Foodies")  user = await Foodies.findById(id);
    else if (location==="SJT")  user = await SJT.findById(id);
    else if (location==="TT")  user = await TT.findById(id);
    else user = await MB.findById(id);
    const currentTime = new Date().getTime();
    // console.log(user);
    const isAvailable = !(user.isBooked) || (user.isBooked && user.BookedDuration !== 1000 && user.Duration < currentTime);
    
    return res.status(200).json({ Available: isAvailable });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/changeavailibility", async (req, res) => {
  const {location, id}=req.body;
  try {
    let user;
    // console.log(location,id);
    if (location==="Foodies")  user = await Foodies.findById(id);
    else if (location==="SJT")  user = await SJT.findById(id);
    else if (location==="TT")  user = await TT.findById(id);
    else user = await MB.findById(id);
    user.isBooked=0;
    await user.save();
    return res.status(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});

app.put('/updateBookingFoodies', async (req, res) => {
  const { id, userId, Dur, time, Duration } = req.body;
  // res.send(req.body);
  try {
    // Find the booking by ID
    const booking = await Foodies.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentTime = new Date().getTime();
    // console.log(currentTime<Duration);
    // console.log(currentTime, " ", Duration);
    // console.log(-currentTime+Duration);
    if (booking.isBooked && currentTime<booking.Duration) { // ala kakunda current time different. (already book aiyna kuuda update request vastundi if it is not there)
      return res.status(404).json({ message: 'Slot just got booked' });
    }

    // Update the booking
    booking.isBooked = 1;
    booking.PersonBooked = userId; // Assign the user ID to the booking
    booking.BookedDuration = Dur;
    booking.BookedTill = time;
    booking.Duration = Duration;

    // Save the updated booking
    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/sjt", async (req, res) => {
  try {
    const user = await SJT.find({});
    console.log("Sucessfully SJT");
    if (!user) {  
      // console.log("Not ssuccess SJT");
      return res.status(404).json({ message: "User not found" });
    }
    const currentTime = new Date().getTime();
    const updatedUsers = user.map(user => {
      if (user.isBooked && user.BookedDuration!=1000 && user.Duration < currentTime) {
        user.isBooked = false; // Update isBooked to false if the booking has expired
      }
      return user;
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/updateBookingSJT', async (req, res) => {
  const { id, userId, Dur, time, Duration } = req.body;
  // res.send(req.body);
  try {
    // Find the booking by ID
    const booking = await SJT.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentTime = new Date().getTime();
    // console.log(currentTime<Duration);
    // console.log(currentTime, " ", Duration);
    // console.log(-currentTime+Duration);
    if (booking.isBooked && currentTime<booking.Duration) { // ala kakunda current time different. (already book aiyna kuuda update request vastundi if it is not there)
      return res.status(404).json({ message: 'Slot just got booked' });
    }

    // Update the booking
    booking.isBooked = 1;
    booking.PersonBooked = userId; // Assign the user ID to the booking
    booking.BookedDuration = Dur;
    booking.BookedTill = time;
    booking.Duration = Duration;

    // Save the updated booking
    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get("/tt", async (req, res) => {
  try {
    const user = await TT.find({});
    console.log("Sucessfully SJT");
    if (!user) {  
      // console.log("Not ssuccess SJT");
      return res.status(404).json({ message: "User not found" });
    }
    const currentTime = new Date().getTime();
    const updatedUsers = user.map(user => {
      if (user.isBooked && user.BookedDuration!=1000 && user.Duration < currentTime) {
        user.isBooked = false; // Update isBooked to false if the booking has expired
      }
      return user;
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/updateBookingtt', async (req, res) => {
  const { id, userId, Dur, time, Duration } = req.body;
  // res.send(req.body);
  try {
    // Find the booking by ID
    const booking = await TT.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentTime = new Date().getTime();
    // console.log(currentTime<Duration);
    // console.log(currentTime, " ", Duration);
    // console.log(-currentTime+Duration);
    if (booking.isBooked && currentTime<booking.Duration) { // ala kakunda current time different. (already book aiyna kuuda update request vastundi if it is not there)
      return res.status(404).json({ message: 'Slot just got booked' });
    }

    // Update the booking
    booking.isBooked = 1;
    booking.PersonBooked = userId; // Assign the user ID to the booking
    booking.BookedDuration = Dur;
    booking.BookedTill = time;
    booking.Duration = Duration;

    // Save the updated booking
    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get("/mb", async (req, res) => {
  try {
    const user = await MB.find({});
    console.log("Sucessfully SJT");
    if (!user) {  
      // console.log("Not ssuccess SJT");
      return res.status(404).json({ message: "User not found" });
    }
    const currentTime = new Date().getTime();
    const updatedUsers = user.map(user => {
      if (user.isBooked && user.BookedDuration!=1000 && user.Duration < currentTime) {
        user.isBooked = false; // Update isBooked to false if the booking has expired
      }
      return user;
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/updateBookingmb', async (req, res) => {
  const { id, userId, Dur, time, Duration } = req.body;
  // res.send(req.body);
  try {
    // Find the booking by ID
    const booking = await MB.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentTime = new Date().getTime();
    // console.log(currentTime<Duration);
    // console.log(currentTime, " ", Duration);
    // console.log(-currentTime+Duration);
    if (booking.isBooked && currentTime<booking.Duration) { // ala kakunda current time different. (already book aiyna kuuda update request vastundi if it is not there)
      return res.status(404).json({ message: 'Slot just got booked' });
    }

    // Update the booking
    booking.isBooked = 1;
    booking.PersonBooked = userId; // Assign the user ID to the booking
    booking.BookedDuration = Dur;
    booking.BookedTill = time;
    booking.Duration = Duration;

    // Save the updated booking
    await booking.save();
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update admin status
app.put("/users/:id/admin", async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { isAdmin }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// {DONT DELETE}
// app.put('/delete', async (req, res) => {
//   try {
//     // Delete all records
//     await Foodies.deleteMany({});
//     res.status(200).json({ message: 'All records deleted successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
app.put('/resetencry', async (req, res) => {
  try {
    // Reset all bookings
    let result = await Foodies.updateMany(
      {}, // Update all documents
      { $set: { isBooked: 0, PersonBooked: "" , BookedTill: "", BookedDuration: 0, Duration: 0} } // Set fields to default values
    );
    result = await SJT.updateMany(
      {}, // Update all documents
      { $set: { isBooked: 0, PersonBooked: "" , BookedTill: "", BookedDuration: 0, Duration: 0} } // Set fields to default values
    );
    result = await MB.updateMany(
      {}, // Update all documents
      { $set: { isBooked: 0, PersonBooked: "" , BookedTill: "", BookedDuration: 0, Duration: 0} } // Set fields to default values
    );
    result = await TT.updateMany(
      {}, // Update all documents
      { $set: { isBooked: 0, PersonBooked: "" , BookedTill: "", BookedDuration: 0, Duration: 0} } // Set fields to default values
    );
    
    // Check if any document was updated
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Bookings reset successfully' });
    } else {
      res.status(404).json({ message: 'No bookings found' });
    }
  } catch (error) {
    console.error("Error resetting bookings:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
