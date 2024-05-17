//import submissionData from './submissionData';
import { Submission } from "~~/types/submission";

export const useSubmissions = async () => {
  const submissions = await useFetch<Submission>("api/submissions");
  return submissions;
};
