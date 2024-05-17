import { defineStore } from "pinia";

export const useResultStore = defineStore("result-store", {
  state: () => ({
    // list all results
    results: [] as Result[],
    schools: [] as School[],
  }),
  getters: {
    schoolCapacity: (state) => state.schools,
  },
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("api/results");
        this.results = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getSchools() {
      try {
        let data = await $fetch("api/schools");
        this.schools = data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async updateResult(result) {
      try {
        let response = await $fetch(`api/results/${result._id}`, {
          method: "POST",
          body: result.update,
        });
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
      console.log(result);
    },
    async adjustRankings(ids) {
      try {
        let response = await $fetch("api/results/adjust-rank", {
          method: "POST",
          body: {
            ids: ids,
          },
        });
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
      console.log(ids);
    },
  },
});