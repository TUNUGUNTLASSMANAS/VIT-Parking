const mongoose = require('mongoose');
// console.log("YES: \n");
mongoose.connect(process.env.mongo);
// mongoose.connect(process.env.mongo, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log("Connected to MongoDB Atlas");
// }).catch((error) => {
//   console.error("Error connecting to MongoDB Atlas", error);
// });
