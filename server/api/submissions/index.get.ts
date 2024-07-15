import SubmissionModel from "~~/server/models/submission.model";
import ResultModel from "~~/server/models/result.model";

export default defineEventHandler(async (event) => {
  const data = await SubmissionModel.find().lean();
  const results = await ResultModel.find(
    {},
    {
      _id: 1,
      submissionId: 1,
      ChoiceRank: 1,
      School: 1,
      lotteryList: 1,
      adjustedRank: 1,
      confirmedEnrollment: 1,
      queueStatus: 1,
    }
  )
    .sort({ ChoiceRank: 1 })
    .lean();

  const topPlacement = (results) => {
    const offer = results.filter(
      (each) => each.lotteryList === "Offered List"
    )[0];
    const wait = results.filter(
      (each) => each.lotteryList === "Waiting List"
    )[0];
    const sec = results.filter(
      (each) => each.lotteryList === "Secondary Waiting List"
    )[0];
    const decline = results.filter(
      (each) => each.lotteryList === "Forfeited"
    )[0];

    if (offer) {
      if (offer.confirmedEnrollment) {
        return { ...offer, status: "Enrolled" };
      } else {
        return { ...offer, status: "Offered" };
      }
    } else if (wait) {
      return { ...wait, status: "Waitlisted" };
    } else if (sec) {
      return { ...sec, status: "Secondary Waitlist" };
    } else if (decline) {
      return { ...decline, status: "Forfeited" };
    } else {
      return {};
    }
  };

  const combined = data.map((item) => ({
    ...item,
    results: results.filter((each) => each.submissionId === item.submissionId),
    topPlacement: topPlacement(
      results.filter((each) => each.submissionId === item.submissionId)
    ),
  }));

  return combined;
});
