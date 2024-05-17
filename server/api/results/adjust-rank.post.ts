import ResultModel from "~~/server/models/result.model";

export default defineEventHandler(async (event) => {
  // Get data form body
  const body = await readBody(event);

  //const filtered = await ResultModel.find({_id: {$in: body.ids});
  const filtered = await ResultModel.updateMany(
    { _id: { $in: body.ids } },
    { $inc: { adjustedRank: -1 } }
  );

  return filtered;
});
