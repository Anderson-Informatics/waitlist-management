<script setup>
const submissions = useSubmissions();

const searchFilter = ref("");
const radioFilter = ref("");
const gradesFilter = ref([]);

const filteredItems = computed(() => {
  let items = submissions;
  switch (radioFilter.value) {
    case "today":
      // show items due today
      break;
    case "past":
      // show past due items
      break;
  }
  if (gradesFilter.value.length) {
    items = items.filter((item) => gradesFilter.value.includes(item.grade));
  }
  if (searchFilter.value !== "") {
    items = items.filter(
      (item) =>
        item.FullName.toLowerCase().includes(searchFilter.value) ||
        item.FirstName.toLowerCase().includes(searchFilter.value) ||
        item.LastName.toLowerCase().includes(searchFilter.value)
    );
  }
  return items;
});

const handleSearch = (search) => {
  searchFilter.value = search.toLowerCase();
};
const handleRadioFilter = (filter) => {
  radioFilter.value = filter;
};
const handleCheckboxFilter = (filter) => {
  if (gradesFilter.value.includes(filter)) {
    return gradesFilter.value.splice(gradesFilter.value.indexOf(filter), 1);
  }
  return gradesFilter.value.push(filter);
};
useHead({
  title: "Submissions",
});
</script>

<template>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        Submissions
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all submissions to K-8 Exam and Montessori schools
      </p>
    </div>
    <!--
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add user</button>
      </div>
      -->
  </div>
  <div class="mt-8 flow-root">
    <div class="flex items-center justify-between">
      <!--Search Form-->
      <SearchForm @search="handleSearch" />
      <!--Filter Radios-->
      <FilterRadios @filter="handleRadioFilter" />
      <!--Filter Dropdow-->
      <FilterDropdown :items="submissions" @filter="handleCheckboxFilter" />
    </div>
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                First
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Last
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Grade
              </th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="subm in filteredItems" :key="subm.submissionId">
              <td
                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
              >
                {{ subm.FullName }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ subm.FirstName }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ subm.LastName }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ new Date(subm.completedAt).toLocaleString() }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ subm.grade }}
              </td>
              <td
                class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
              >
                <NuxtLink
                  :to="`/submissions/${subm.submissionId}`"
                  class="text-indigo-600 hover:text-indigo-900"
                  >View<span class="sr-only"></span
                ></NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
