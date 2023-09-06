import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
  username: string
  email: string
  password: string
}
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", schema);
export default User;
