const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    _id:String,
    isBooked:Boolean,
    PersonBooked:String,
    BookedTill:String,
    BookedDuration:Number,
    Duration:Number
})
module.exports=mongoose.model("mb",userSchema,'mb');
