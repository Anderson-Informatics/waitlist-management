export type Result = {
  _id: string;
  submissionId: number;
  rank: number;
  entries?: number;
  Grade: string;
  SchoolID: number;
  School: string;
  FirstName: string;
  LastName: string;
  ChoiceRank: number;
  Priority?: number;
  submissionDate: string;
  lotteryList: string;
  adjustedRank?: number;
  TestDate?: string;
};
