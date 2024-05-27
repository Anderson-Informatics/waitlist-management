import { defineStore } from "pinia";

export const useChangeStore = defineStore("change-store", {
  state: () => ({
    // list all results
    changes: [],
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("/api/changes");
        this.history = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async addChange(body) {
      try {
        // Maybe I can figure out how to fix this full URL in the long term?
        let response = await $fetch("/api/changes/add", {
          method: "POST",
          body: body,
        });
        console.log(response);
        return response;
      } catch (e) {
        console.log(e.message);
      }
    },
  },
});
