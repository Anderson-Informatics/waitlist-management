import SchoolModel from "~~/server/models/school.model";
import ResultModel from "~~/server/models/result.model";

export default defineEventHandler(async (event) => {
  const schools = await SchoolModel.find();

  const counts = await ResultModel.aggregate([
    [
      {
        $group: {
          _id: {
            SchoolID: "$SchoolID",
            School: "$School",
            Grade: "$Grade",
          },
          SeatsFilled: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ["Offered List", "$lotteryList"],
                    },
                    {
                      $eq: ["Offer Pending", "$queueStatus"],
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          OnWaitingList: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ["Waiting List", "$lotteryList"],
                    },
                    {
                      $eq: ["Secondary Waiting List", "$lotteryList"],
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    ],
  ]);

  const schcap = schools.map((item) => ({
    SchoolID: item.SchoolID,
    School: item.School,
    ...item.Capacity,
  }));

  const unwindCapacity = (object) => {
    return Object.keys(object.Capacity).map((item) => ({
      SchoolID: object.SchoolID,
      School: object.SchoolName,
      Grade: item,
      Capacity: object.Capacity[item],
    }));
  };

  const createCapacity = (x) => {
    let full = [];
    x.forEach((element) => {
      full.push(...unwindCapacity(element));
    });
    return full;
  };

  const unwound = createCapacity(schools);

  const seats = counts
    .map((item) => ({
      ...item._id,
      ...item,
    }))
    .map(({ _id, ...item }) => item);

  const partialCapacityTable = [];

  seats.forEach((seat) => {
    const capacityItem = unwound.find(
      (item) => seat.SchoolID === item.SchoolID && seat.Grade === item.Grade
    );

    if (capacityItem) {
      partialCapacityTable.push({
        ...seat,
        ...capacityItem,
      });
    }
  });

  const fullCapacityTable = partialCapacityTable.map((item) => ({
    ...item,
    SeatsAvailable: item.Capacity - item.SeatsFilled,
  }));

  //const clean = seats.map(({ _id, ...item }) => item);

  return fullCapacityTable;
});
