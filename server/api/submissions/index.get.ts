import SubmissionModel from "~~/server/models/submission.model";

export default defineEventHandler(async (event) => {
  const submissions = await SubmissionModel.find();

  return submissions;
});
