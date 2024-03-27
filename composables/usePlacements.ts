import placmentData from './placementData';

type Placement = {
  submissionId: number,
  fname: string,
  lname: string,
  schoolId: number,
  school: string,
  choiceRank: number,
  grade: string,
  lotteryRank: number,
  offerRank?: number,
  waitlistRank?: number,
  secondaryWaitlistRank?: number,
  lotteryList: string,
  priority: number,
  roundProcessed?: string,
  roundNotified?: string,
}

export const usePlacements = () => {
  return placmentData.placements;
}