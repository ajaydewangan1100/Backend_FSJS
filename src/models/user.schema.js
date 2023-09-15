import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";

const userSchema = new Schema.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
      maxLength: [50, "Name must be less than 50 chars"],
    },
    email: {
      type: String,
      required: ["true", "Email is required"],
    },
    password: {
      type: String,
      select: false,
      required: ["true", "Password is required"],
      minLength: [8, "PAssword must be atleast 8 chars"],
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timeStamps: true }
);

export default mongoose.model("User", userSchema);

// here encrypt the password before saving -> hooks
