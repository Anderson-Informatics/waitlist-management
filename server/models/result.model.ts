import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: String,
  submissionId: Number,
  rank: Number,
  entries: Number,
  Grade: String,
  SchoolID: Number,
  School: String,
  FirstName: String,
  LastName: String,
  ChoiceRank: Number,
  Priority: Number,
  submissionDate: String,
  lotteryList: String,
  adjustedRank: Number,
  TestDate: String,
});

// results model
export default mongoose.model("Result", schema);
