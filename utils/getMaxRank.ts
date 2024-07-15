// It will be available as randomEntry() (camelCase of file name without extension)
export default function (payload: Object, results: Array, list: String) {
  const filteredList = results.filter(
    (item) =>
      item.SchoolID === payload.SchoolID &&
      item.Grade === payload.Grade &&
      item.lotteryList === list
  );
  const maxRank = Math.max(...filteredList.map((x) => x.adjustedRank));
  if (!maxRank) {
    return 0;
  } else {
    return maxRank;
  }
}
