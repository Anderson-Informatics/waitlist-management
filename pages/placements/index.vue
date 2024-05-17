<script setup lang="ts">
import type { Header, Item, FilterOption } from "vue3-easy-data-table";

// Get the results data from the Pinia store
const resultStore = useResultStore();
await useAsyncData("results", () => resultStore.getAll(), {});

//Search for record in table
const search = ref("");
//Grade Filter array
const gradeFilter = ref([]);
const schoolFilter = ref([]);

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];
  if (gradeFilter.value.length) {
    filterOptionsArray.push({
      field: "Grade",
      comparison: "in",
      criteria: gradeFilter.value,
    });
  }
  if (schoolFilter.value.length) {
    filterOptionsArray.push({
      field: "School",
      comparison: "in",
      criteria: schoolFilter.value,
    });
  }
  return filterOptionsArray;
});

const grades = ref([
  "Pre-K",
  "Kindergarten",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
]);

const schools = ref([
  "Bates Academy",
  "Chrysler Elementary",
  "Edison Elementary",
  "Edmonson Elementary",
  "Foreign Language Immersion and Cultural Studies School",
  "Palmer Park Preparatory Academy",
  "The School at Marygrove",
]);

const showGradeFilter = ref(false);
const showSchoolFilter = ref(false);

// headers for the table
const headers: Header[] = [
  { text: "#", value: "rank", sortable: true },
  { text: "School", value: "School" },
  { text: "List", value: "lotteryList", sortable: true },
  { text: "Rank", value: "adjustedRank", sortable: true },
  { text: "First", value: "FirstName", sortable: true },
  { text: "Last", value: "LastName", sortable: true },
  { text: "Grade", value: "Grade", width: 100 },
];
</script>
<template>
  <div>
    <div>
      <div class="flex">
        <div class="relative w-full grow">
          <input
            placeholder="Search..."
            v-model="search"
            type="search"
            name="search"
            id="search"
            class="p-2 mb-2 w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-md text-sm"
          />
        </div>
      </div>
      <EasyDataTable
        :search-value="search"
        empty-message="No results found"
        :headers="headers"
        :items="resultStore.results"
        :filter-options="filterOptions"
      >
        <template #header-School="header">
          <div class="filter-column">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 inline"
              @click.stop="showSchoolFilter = !showSchoolFilter"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            {{ header.text }}
            <div
              v-if="showSchoolFilter"
              class="absolute top-10 left-1 z-10 w-100 p-3 bg-white rounded-lg shadow"
            >
              <ul class="text-left">
                <li v-for="(school, index) in schools">
                  <input
                    :id="index"
                    type="checkbox"
                    v-model="schoolFilter"
                    :value="school"
                    class="w-4 h-4 bg-gray-300 rounded text-sm"
                  />
                  <label
                    :for="index"
                    class="ml-2 text-sm font-medium text-gray-900"
                    >{{ school }}</label
                  >
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template #header-Grade="header">
          <div class="filter-column">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 inline"
              @click.stop="showGradeFilter = !showGradeFilter"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            {{ header.text }}
            <div
              v-if="showGradeFilter"
              class="absolute top-10 right-1 z-10 w-40 p-3 bg-white rounded-lg shadow"
            >
              <ul class="text-left">
                <li v-for="(grade, index) in grades">
                  <input
                    :id="index"
                    type="checkbox"
                    v-model="gradeFilter"
                    :value="grade"
                    class="w-4 h-4 bg-gray-300 rounded text-sm"
                  />
                  <label
                    :for="index"
                    class="ml-2 text-sm font-medium text-gray-900"
                    >{{ grade }}</label
                  >
                </li>
              </ul>
            </div>
          </div>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>
