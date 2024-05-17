import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: String,
  SchoolID: Number,
  SchoolName: String,
  Lat: Number,
  Lng: Number,
  Type: String,
  ShortName: String,
  CapPK: Number,
  CapK: Number,
  Cap1: Number,
  Cap2: Number,
  Cap3: Number,
  Cap4: Number,
  Cap5: Number,
  Cap6: Number,
  Cap7: Number,
  Cap8: Number,
  Capacity: Object,
});

// schools model
export default mongoose.model("School", schema);
