import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    firstName : {
        type : String,
        required: true
    },
    lastName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        default : "customer"
    },
    isBlocked : {
        type : Boolean,
        required : true,
        default : false
    },
    img : {
        type : String,
        required : false,
        default : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=6hQNACQQjktni8CxSS_QSPqJv2tycskYmpFGzxv3FNs="
    }
})

const User = mongoose.model("users", userSchema)

export default User;