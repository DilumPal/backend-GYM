import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email : {
        require: true,
        type: String
    },
    otp : {
        require: true,
        type: Number
    }
})

const OTP = mongoose.model("OTP", otpSchema)
export default OTP;