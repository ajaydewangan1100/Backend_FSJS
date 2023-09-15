import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";

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
// this will run just before saving user and runs only first time at the time of saving the user details
// attaching here hook to userSchema to perform action
userSchema.pre("save", async function (params) {
  if (this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// methods for checking or updating things under DB before update or after update
userSchema.methods = {
  // compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
};
