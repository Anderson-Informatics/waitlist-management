<script setup>
const searchFilter = ref("");
const gradesFilter = ref([]);

const placements = usePlacements();
const programs = computed(() => {
  return [...new Set(placements.map((item) => item.school))];
});

const filteredItems = computed(() => {
  let items = placements;
  if (gradesFilter.value.length) {
    items = items.filter((item) => gradesFilter.value.includes(item.grade));
  }
  if (searchFilter.value !== "") {
    items = items.filter(
      (item) =>
        item.fname.toLowerCase().includes(searchFilter.value) ||
        item.lname.toLowerCase().includes(searchFilter.value)
    );
  }
  let programs = [...new Set(items.map((item) => item.school))];
  return { items: items, programs: programs };
});

const handleSearch = (search) => {
  searchFilter.value = search.toLowerCase();
};
const handleCheckboxFilter = (filter) => {
  if (gradesFilter.value.includes(filter)) {
    return gradesFilter.value.splice(gradesFilter.value.indexOf(filter), 1);
  }
  return gradesFilter.value.push(filter);
};
useHead({
  title: "Placements",
});
</script>

<template>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        Placements
      </h1>
      <p class="mt-2 text-sm text-gray-700">The full placement results</p>
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
      <!--Filter Dropdown-->
      <FilterDropdown :items="placements" @filter="handleCheckboxFilter" />
    </div>

    <div class="columns-6 flex">
      <div
        v-for="program in filteredItems.programs"
        class="break-after-column m-2"
      >
        <h2>{{ program }}</h2>
        <div v-for="item in filteredItems.items" class="leading-none">
          <span
            v-if="item.school === program"
            class="text-2xs"
            :class="item.declinedOffer && 'line-through'"
          >
            {{ item.lotteryRank }} - {{ item.fname }} {{ item.lname }},
            {{ item.grade }}
          </span>
        </div>
        <!--
          <h3>Offer List</h3>
          <div v-for="item in filteredItems">
            <span v-if="item.offerRank & item.school === program" class="text-xs">{{ item.offerRank }} - {{ item.fname }} {{ item.lname }}, {{ item.grade }}</span>
          </div>
          <h3>Waiting List</h3>
          <div v-for="item in filteredItems">
            <span v-if="item.waitlsitRank & item.school === program" class="text-xs">{{item.waitlistRank}} - {{ item.fname }} {{ item.lname }}, {{ item.grade }}</span>
          </div>
          <h4>Secondary Waiting List</h4>
          <div v-for="item in filteredItems">
            <span v-if="item.secondaryWaitlsitRank & item.school === program" class="text-xs">{{item.secondaryWaitlistRank}} - {{ item.fname }} {{ item.lname }}, {{ item.grade }}</span>
          </div>
        -->
      </div>
    </div>
  </div>
</template>
