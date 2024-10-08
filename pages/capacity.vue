<script setup lang="ts">
import type {
  Header,
  Item,
  FilterOption,
  SortType,
} from "vue3-easy-data-table";
import { useToast } from "primevue/usetoast";

// Get the results and schools data from the Pinia store
const resultStore = useResultStore();
await useAsyncData("results", () => resultStore.getAll(), {});
await useAsyncData("schools", () => resultStore.getSchools(), {});
await useAsyncData("capacity", () => resultStore.getCapacity(), {});
const changeStore = useChangeStore();
await useAsyncData("changes", () => changeStore.getAll(), {});

// Testing the use of toast
const toast = useToast();

const showSuccess = (message) => {
  toast.add({
    severity: "success",
    summary: "Changes Successfully Made",
    detail: message,
    life: 6000,
  });
};
const showError = () => {
  toast.add({
    severity: "error",
    summary: "Error Message",
    detail: "Message Content",
    life: 3000,
  });
};

// Get the user value for change logging
const user = useSupabaseUser();

//Search for record in table
const search = ref("");
//Grade Filter array
const gradeFilter = ref([]);
const schoolFilter = ref([]);

// This is the filter function used by vue3-easy-data-table
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

// Dropdown options for the different filter menus
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
const schoolNames = ref([
  "Bates Academy",
  "Chrysler Elementary",
  "Edison Elementary",
  "Edmonson Elementary",
  "Foreign Language Immersion and Cultural Studies School",
  "Palmer Park Preparatory Academy",
  "The School at Marygrove",
]);

// This is the toggle for the dropdown filters
const showGradeFilter = ref(false);
const showSchoolFilter = ref(false);

// headers for the table
const headers: Header[] = [
  { text: "School", value: "School" },
  { text: "Grade", value: "Grade", width: 100 },
  { text: "Capacity", value: "Capacity", width: 150 },
  { text: "Filled", value: "SeatsFilled", sortable: true },
  { text: "Available", value: "SeatsAvailable", sortable: true },
  { text: "On Waitlist", value: "OnWaitingList", sortable: true },
  { text: "Actions", value: "actions" },
];

const sortBy: string[] = ["School", "Grade"];
const sortType: SortType[] = ["asc", "asc"];

// Helpers for the edit modal component
const selectedResult = ref({});
const showModal = ref(false);
const pendingChanges = ref([]);
const pendingStatus = ref(false);
const buttonText = ref("Check");
const pendingIds = ref([]);

// This will reset the edit modal component
const loadItem = (val: Item) => {
  selectedResult.value = val;
  showModal.value = true;
  // These are the empty starting defaults for the form
  pendingChanges.value = [];
  pendingStatus.value = false;
  buttonText.value = "Check";
  pendingIds.value = [];
};
const checkLowerOffers = (payload: Object) => {
  let offers = resultStore.results.filter(
    (item) =>
      item.submissionId === payload.submissionId && item._id != payload._id
  );
};
const adjustRankings = (payload: Object) => {
  // filter to the same school, grade, and lotteryList and lower ranked results
  let filtered = resultStore.results.filter(
    (item) =>
      item.SchoolID === payload.SchoolID &&
      item.Grade === payload.Grade &&
      item.lotteryList === payload.lotteryList &&
      item.adjustedRank > payload.adjustedRank
  );
  // Create an Array of ids from the lower ranked results
  let ids = filtered.map((item) => item._id);
  if (payload.stage === "Check") {
    // Add info to pending changes array to display as interim step
    pendingChanges.value.push(
      `Move ${ids.length} applicants up the ${payload.lotteryList}`
    );
  }
  if (payload.stage === "Submit Changes") {
    // Update the filtered Pinia Store
    filtered.map((obj) => {
      return { ...obj, adjustedRank: (obj.adjustedRank += -1) };
    });
    // Send the ids to update the list rankings
    resultStore.adjustRankings(ids);
    //resultStore.adjustRankings(payload);
    showSuccess(`Moved ${ids.length} applicants up the ${payload.lotteryList}`);
  }
};
// This is the function to pull an applicant off the waitlist
const makeOffer = (payload: Object) => {
  const offer = resultStore.results
    .filter(
      (item) =>
        item.SchoolID === payload.SchoolID &&
        item.Grade === payload.Grade &&
        item.lotteryList === "Waiting List" &&
        item.queueStatus !== "Offer Pending"
    )
    .sort((a, b) => a.adjustedRank - b.adjustedRank)[0];
  if (payload.stage === "Check") {
    pendingStatus.value = true;
    buttonText.value = "Submit Changes";
    // Update pending information before pushing new information
    pendingChanges.value.push(
      `Add ${offer.FirstName} ${offer.LastName} at ${offer.School}, grade ${offer.Grade} to 'Offer Pending' list`
    );
    pendingIds.value.push(offer._id);
  }
  if (payload.stage === "Submit Changes") {
    // This updates the pinia state directly WOW!
    offer.queueStatus = "Offer Pending";
    offer.queueDate = new Date();
    // Send the Offer Pending information to update
    resultStore.updateResult({
      _id: offer._id,
      update: {
        queueStatus: "Offer Pending",
        queueDate: new Date(),
      },
    });
    showSuccess(
      `Added ${offer.FirstName} ${offer.LastName} at ${offer.School}, grade ${offer.Grade} to 'Offer Pending' list`
    );
    setTimeout(() => {
      showModal.value = false;
      selectedResult.value = {};
    }, 1000);
  }
  //adjustRankings(offer);
};
// Update School/Grade capacity
const updateCapacity = (payload: Object) => {
  const capacityObj = resultStore.capacity.find(
    (item) => item.SchoolID === payload.SchoolID && item.Grade === payload.Grade
  );
  if (payload.stage === "Check") {
    pendingStatus.value = true;
    buttonText.value = "Submit Changes";
    pendingChanges.value.push(
      `Change capacity at ${payload.School}, grade ${payload.Grade} from ${capacityObj.Capacity} to ${payload.Capacity}`
    );
    pendingIds.value.push(payload._id);
  }
  if (payload.stage === "Submit Changes") {
    // Update the Pinia store for the School capacity at grade level
    capacityObj.Capacity = payload.Capacity;
    // Send the school data to update the capacity for the grade level selected
    resultStore.updateCapacity(payload);

    // UPDATE Seat Availability

    showSuccess(
      `Changed capacity at ${payload.School}, grade ${payload.Grade} from ${capacityObj.Capacity} to ${payload.Capacity}`
    );

    setTimeout(() => {
      showModal.value = false;
      selectedResult.value = {};
    }, 1000);
  }
};
const addToWaitingList = (payload: Object) => {
  if (payload.lotteryList === "Forfeited") {
    // This will mark the pending status and continue to similate the changes
    if (payload.stage === "Check") {
      pendingStatus.value = true;
      buttonText.value = "Submit Changes";
      pendingChanges.value.push(
        `Change ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to 'Waiting List'`
      );
      pendingIds.value.push(payload._id);
    }
    // Once changes have been similated/pending, actually make the changes
    if (payload.stage === "Submit Changes") {
      const maxRank = getMaxRank(payload, resultStore.results, "Waiting List");
      console.log(`Waiting list max rank: ${maxRank}`);
      // add the pending changes to the history log
      const changeObj = {
        changes: pendingChanges.value,
        ids: pendingIds.value,
        userId: user.value.id,
        userEmail: user.value.email,
        notes: payload.notes,
        date: new Date(),
      };
      changeStore.addChange(changeObj);
      // Update the Pinia store for the result being changed to "Decline"
      const waitlistObj = resultStore.results.find(
        (item) => item._id === payload._id
      );
      waitlistObj.lotteryList = "Waiting List";
      waitlistObj.adjustedRank = maxRank + 1;
      // Send the decline information to update
      resultStore.updateResult({
        _id: payload._id,
        update: {
          lotteryList: "Waiting List",
          adjustedRank: maxRank + 1,
        },
      });
      showSuccess(
        `Changed ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to 'Waiting List'`
      );

      setTimeout(() => {
        showModal.value = false;
        selectedResult.value = {};
      }, 1000);
    }
  }
};
// This will check for available seats and run the makeOffer function if seats available
const checkWaitlist = (payload: Object) => {
  // Get the capacity for the select school
  const capacity = resultStore.schools.filter(
    (item) => item.SchoolID === payload.SchoolID
  )[0].Capacity[payload.Grade];
  // Calculate the number of seats filled
  const filled = resultStore.results.filter(
    (item) =>
      item.SchoolID === payload.SchoolID &&
      item.Grade === payload.Grade &&
      ["Offered List", "Offer Pending", "Confirmed Enrollment"].includes(
        item.lotteryList
      )
  ).length;
  if (filled <= capacity) {
    makeOffer(payload);
  }
};
const modifyProperty = (arr, targetId, newProperty) => {
  const targetObj = arr.find((obj) => obj._id === targetId);
  if (targetObj) {
    targetObj.employee_name = newProperty;
  }
};
const moveToList = (payload: Object, list: String) => {
  console.log(payload.action);
  // Calculate the proper adjustedRank based on the new list
  const maxRank = getMaxRank(payload, resultStore.results, list);
  console.log(`Testing MaxRank Calculation: ${maxRank} on ${list}`);
  // This will mark the pending status and continue to similate the changes
  if (payload.stage === "Check") {
    pendingStatus.value = true;
    buttonText.value = "Submit Changes";
    pendingChanges.value.push(
      `Change ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to '${list}''`
    );
    pendingIds.value.push(payload._id);
  }
  // Will run everytime to simulate the changes and/or make the changes
  adjustRankings(payload);
  if (payload.lotteryList === "Offered List") {
    checkWaitlist(payload);
  }
  // Once changes have been similated/pending, actually make the changes
  if (payload.stage === "Submit Changes") {
    // add the pending changes to the history log
    const changeObj = {
      changes: pendingChanges.value,
      ids: pendingIds.value,
      userId: user.value.id,
      userEmail: user.value.email,
      notes: payload.notes,
      date: new Date(),
    };
    changeStore.addChange(changeObj);
    // If the original status being decline is from the offered list, remove the Accept - School label
    if (payload.lotteryList === "Offered List" && list === "Forfeited") {
      deleteLabel(payload, "Accept");
    } else if (payload.lotteryList === "Waiting List" && list === "Forfeited") {
      // Remove the original Waitlist - School label if it exists
      deleteLabel(payload, "Waitlist");
    } else if (
      payload.lotteryList === "Forefeited" &&
      list === "Waiting List"
    ) {
      addLabel(payload, "Waitlist");
    }
    // Update the Pinia store for the result being changed to "Decline"
    const updateObj = resultStore.results.find(
      (item) => item._id === payload._id
    );
    updateObj.lotteryList = list;
    if (list === "Forfeited") {
      updateObj.adjustedRank = null;
      // Send the decline information to update
      resultStore.updateResult({
        _id: payload._id,
        update: {
          lotteryList: list,
          adjustedRank: null,
        },
      });
    } else {
      updateObj.adjustedRank = maxRank + 1;
      // Send the decline information to update
      resultStore.updateResult({
        _id: payload._id,
        update: {
          lotteryList: list,
          adjustedRank: maxRank + 1,
        },
      });
    }
    showSuccess(
      `Changed ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to '${list}'`
    );
    setTimeout(() => {
      showModal.value = false;
      selectedResult.value = {};
    }, 1000);
  }
};
const manualPositionChange = (payload: Object) => {
  payload.newList;
  payload.lotteryList;
};
const addLabel = (payload: Object, type: String) => {
  resultStore.addLabel(payload, type);
};
const deleteLabel = (payload: Object, type: String) => {
  resultStore.deleteLabel(payload, type);
};
const confirmEnrollment = (payload: Object) => {
  // This will mark the pending status and continue to simulate the changes
  if (payload.stage === "Check") {
    pendingStatus.value = true;
    buttonText.value = "Submit Changes";
    pendingChanges.value.push(
      `Confirm Enrollment for ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade}`
    );
    pendingIds.value.push(payload._id);
  }
  if (payload.stage === "Submit Changes") {
    // add the pending changes to the history log
    const changeObj = {
      changes: pendingChanges.value,
      ids: pendingIds.value,
      userId: user.value.id,
      userEmail: user.value.email,
      notes: payload.notes,
      date: new Date(),
    };
    changeStore.addChange(changeObj);
    // Update the Pinia store for the result being changed to "Decline"
    const updObj = resultStore.results.find((item) => item._id === payload._id);
    updObj.confirmedEnrollment = true;
    // Send change to database
    resultStore.updateResult({
      _id: payload._id,
      update: {
        confirmedEnrollment: true,
      },
    });
    showSuccess(
      `Confirm Enrollment for ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade}`
    );
    setTimeout(() => {
      showModal.value = false;
      selectedResult.value = {};
    }, 1000);
  }
};
const runAction = (payload: Object) => {
  if (payload.action === "Update capacity") {
    updateCapacity(payload);
  } else if (payload.action === "Pull one off of waiting list") {
    makeOffer(payload);
  } else {
    console.log(user.value.id, user.value.email);
    console.log("runAction:", payload.action);
  }
};
</script>
<template>
  <CapacityModal
    :item="selectedResult"
    :open="showModal"
    :changes="pendingChanges"
    :pending="pendingStatus"
    :button="buttonText"
    @close-modal="
      showModal = false;
      selectedResult = {};
    "
    @run-action="runAction"
  />
  <div class="card flex justify-center">
    <Toast />
  </div>
  <div class="w-full mb-4">
    <h2>Manage school capacity and seat availability.</h2>
  </div>
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
  <ClientOnly>
    <EasyDataTable
      :search-value="search"
      empty-message="No results found"
      :headers="headers"
      :items="resultStore.capacity"
      :filter-options="filterOptions"
      :sort-by="sortBy"
      :sort-type="sortType"
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
            v-click-outside="() => (showSchoolFilter = false)"
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
            class="absolute top-10 left-1 z-10 w-80 p-3 bg-white rounded-lg shadow"
          >
            <ul class="text-left">
              <li v-for="(school, index) in schoolNames">
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
            v-click-outside="() => (showGradeFilter = false)"
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
            class="absolute top-10 left-1 z-10 w-40 p-3 bg-white rounded-lg shadow"
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
      <template #item-actions="item">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            @click="loadItem(item)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
      </template>
    </EasyDataTable>
  </ClientOnly>
</template>
