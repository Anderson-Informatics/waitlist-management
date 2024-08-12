import { defineStore } from "pinia";

export const useResultStore = defineStore("result-store", {
  state: () => ({
    // list all results
    results: [] as Result[],
    schools: [] as School[],
    capacity: [] as Capacity[],
    pendingOffers: [] as Result[],
  }),
  getters: {
    schoolCapacity: (state) => state.schools,
  },
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("/api/results");
        this.results = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getPending() {
      try {
        let data = await $fetch("/api/results/pending");
        this.pendingOffers = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getSchools() {
      try {
        let data = await $fetch("/api/schools");
        this.schools = data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getCapacity() {
      try {
        let data = await $fetch("/api/schools/capacity");
        this.capacity = data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async updateCapacity(school) {
      try {
        let response = await $fetch(`/api/schools/capacity/update`, {
          method: "POST",
          body: school,
        });
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
      console.log(school);
    },
    async updateResult(result) {
      try {
        let response = await $fetch(`/api/results/${result._id}`, {
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
        let response = await $fetch("/api/results/adjust-rank", {
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
    async addLabel(result, type: String) {
      try {
        let response = await $fetch("/api/submittable/add", {
          method: "POST",
          body: { ...result, type: type },
        });
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
    },
    async deleteLabel(result, type: String) {
      try {
        let response = await $fetch("/api/submittable/delete", {
          method: "POST",
          body: { ...result, type: type },
        });
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
    },
  },
});
