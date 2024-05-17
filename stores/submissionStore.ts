import { defineStore } from "pinia";

export const useSubmissionStore = defineStore("submission-store", {
  state: () => ({
    // list all results
    submissions: [],
    submission: {},
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("http://localhost:3000/api/submissions");
        this.submissions = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getOne(submissionId) {
      try {
        // Maybe I can figure out how to fix this full URL in the long term?
        let data = await $fetch(
          `http://localhost:3000/api/submissions/${submissionId}`
        );
        this.submission = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
  },
});
