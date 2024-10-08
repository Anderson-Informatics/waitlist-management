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
await useAsyncData("pendingOffers", () => resultStore.getPending(), {});
await useAsyncData("schools", () => resultStore.getSchools(), {});
const changeStore = useChangeStore();
await useAsyncData("changes", () => changeStore.getAll(), {});

// Testing the use of toast
const toast = useToast();

const showSuccess = (message) => {
  toast.add({
    severity: "success",
    summary: "Changes Successfully Made",
    detail: message,
    life: 5000,
  });
};
const showInfo = () => {
  toast.add({
    severity: "info",
    summary: "Info Message",
    detail: "Message Content",
    life: 3000,
  });
};
const showWarn = () => {
  toast.add({
    severity: "warn",
    summary: "Warn Message",
    detail: "Message Content",
    life: 3000,
  });
};
const showError = () => {
  toast.add({
    severity: "error",
    summary: "Error Message",
    detail: "Message Content",
    life: 6000,
  });
};
const showSecondary = () => {
  toast.add({
    severity: "secondary",
    summary: "Secondary Message",
    detail: "Message Content",
    life: 3000,
  });
};
const showContrast = () => {
  toast.add({
    severity: "contrast",
    summary: "Contrast Message",
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
const listFilter = ref([]);

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
  if (listFilter.value.length) {
    filterOptionsArray.push({
      field: "lotteryList",
      comparison: "in",
      criteria: listFilter.value,
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
const lists = ref([
  "Offered List",
  "Waiting List",
  "Secondary Waiting List",
  "Forfeited",
]);

// This is the toggle for the dropdown filters
const showGradeFilter = ref(false);
const showSchoolFilter = ref(false);
const showListFilter = ref(false);

// headers for the table
const headers: Header[] = [
  { text: "Date Added", value: "queueDate", sortable: true },
  { text: "School", value: "School" },
  { text: "Grade", value: "Grade", width: 100 },
  { text: "List", value: "list", width: 150 },
  { text: "Rank", value: "adjustedRank", sortable: true },
  { text: "First", value: "FirstName", sortable: true },
  { text: "Last", value: "LastName", sortable: true },
  { text: "Choice", value: "ChoiceRank", sortable: true },
  { text: "Actions", value: "actions" },
];

const sortBy = "queueDate";
const sortType: SortType = "asc";

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
const addLabel = (payload: Object, type: String) => {
  resultStore.addLabel(payload, type);
};
const deleteLabel = (payload: Object, type: String) => {
  resultStore.deleteLabel(payload, type);
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
  }
  //adjustRankings(offer);
};
// This will check for available seats and run the makeOffer function if seats available
const checkWaitlist = (payload: Object) => {
  // Get the capacity for the select school
  const capacity = resultStore.schools.filter(
    (item) => item.SchoolID === payload.SchoolID
  )[0].Capacity[payload.Grade];
  console.log("From checkWaitlist function: ", capacity);
  // Calculate the number of seats filled
  const filled = resultStore.results.filter(
    (item) =>
      item.SchoolID === payload.SchoolID &&
      item.Grade === payload.Grade &&
      // Fix this to account for offer pending students
      (item.lotteryList === "Offered List" ||
        item.queueStatus === "Offer Pending")
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
const runAcceptOffer = (payload: Object) => {
  // This will mark the pending status and continue to similate the changes
  if (payload.stage === "Check") {
    console.log("Running accept offer check function");
    pendingStatus.value = true;
    buttonText.value = "Submit Changes";
    pendingChanges.value.push(
      `Change ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to 'Offered List'`
    );
    pendingIds.value.push(payload._id);
  }
  // Will run everytime to simulate the changes and/or make the changes
  adjustRankings(payload);
  // Check lower results from applicant
  const lowerResults = resultStore.results.filter(
    (item) =>
      item.submissionId === payload.submissionId &&
      item.ChoiceRank > payload.ChoiceRank
  );
  // Use the getMaxRank util function to get the maxRank of the Offered List
  const maxRank = getMaxRank(payload, resultStore.results, "Offered List");
  // Run the decline offer for the other lower ranked Results
  lowerResults.forEach((item) => {
    let temp = {
      ...item,
      stage: payload.stage,
      action: "Decline lower ranked choices",
    };
    moveToList(temp, "Forfeited");
  });
  // Once changes have been similated/pending, actually make the changes
  if (payload.stage === "Submit Changes") {
    console.log("Running accept offer submit function");
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
    // Update the Pinia store for the result being changed to "Offered List"
    const acceptObj = resultStore.results.find(
      (item) => item._id === payload._id
    );
    const pendingOffer = resultStore.pendingOffers.find(
      (item) => item._id === payload._id
    );
    acceptObj.lotteryList = "Offered List";
    acceptObj.adjustedRank = maxRank + 1;
    acceptObj.queueStatus = null;
    pendingOffer.lotteryList = "Offered List";
    pendingOffer.adjustedRank = maxRank + 1;
    pendingOffer.queueStatus = null;
    // Add the Accept - School label
    addLabel(payload, "Accept");
    // Remove the Waitlist - School label
    deleteLabel(payload, "Waitlist");
    // Send the offer information to update
    resultStore.updateResult({
      _id: payload._id,
      update: {
        lotteryList: "Offered List",
        adjustedRank: maxRank + 1,
        queueStatus: null,
      },
    });
    showSuccess(
      `Changed ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to 'Offered List'`
    );

    setTimeout(() => {
      showModal.value = false;
      selectedResult.value = {};
    }, 1000);
  }
};
const moveToList = (payload: Object, list: String) => {
  if (payload.lotteryList !== "Forfeited") {
    console.log(payload.action, payload.lotteryList, payload.queueStatus, list);
    // Calculate the proper adjustedRank based on the new list
    const maxRank = getMaxRank(payload, resultStore.results, list);
    // This will mark the pending status and continue to similate the changes
    if (payload.stage === "Check") {
      pendingStatus.value = true;
      buttonText.value = "Submit Changes";
      pendingChanges.value.push(
        `Change ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to '${list}'`
      );
      pendingIds.value.push(payload._id);
    }
    // Will run everytime to simulate the changes and/or make the changes
    adjustRankings(payload);
    if (
      (payload.lotteryList === "Offered List" ||
        payload.queueStatus === "Offer Pending") &&
      (list === "Forfeited" || list === "Secondary Waiting List")
    ) {
      console.log("Met testing criteria");
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
      // Remove the original Accept - School label if it exists
      if (payload.lotteryList === "Offered List" && list === "Forfeited") {
        deleteLabel(payload, "Accept");
        addLabel(payload, "Update");
      } else if (
        payload.lotteryList === "Waiting List" &&
        list === "Forfeited"
      ) {
        // Remove the original Waitlist - School label if it exists
        deleteLabel(payload, "Waitlist");
      } else {
      }
      // Update the Pinia store for the result being changed to "Decline"
      const updateObj = resultStore.results.find(
        (item) => item._id === payload._id
      );
      updateObj.lotteryList = list;
      updateObj.adjustedRank = null;
      updateObj.queueStatus = null;
      // Send the decline information to update
      resultStore.updateResult({
        _id: payload._id,
        update: {
          lotteryList: list,
          adjustedRank: null,
          queueStatus: null,
        },
      });
      showSuccess(
        `Changed ${payload.FirstName} ${payload.LastName} at ${payload.School}, grade ${payload.Grade} from '${payload.lotteryList}' to '${list}'`
      );
      setTimeout(() => {
        showModal.value = false;
        selectedResult.value = {};
      }, 1000);
    }
  }
};
const manualPositionChange = (payload: Object) => {
  payload.newList;
  payload.lotteryList;
};
const runAction = (payload: Object) => {
  if (payload.action === "Accept Offer") {
    runAcceptOffer(payload);
  } else if (payload.action === "Decline Offer") {
    moveToList(payload, "Forfeited");
  } else {
    console.log(user.value.id, user.value.email);
    console.log("runAction:", payload.action);
  }
};
</script>
<template>
  <OfferModal
    :result="selectedResult"
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
    <h2>Make calls to parents to make offers off of waitlist.</h2>
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
      :items="resultStore.pendingOffers"
      :filter-options="filterOptions"
      :sort-by="sortBy"
      :sort-type="sortType"
    >
      <template #expand="item">
        <div style="padding: 15px" class="columns-2 flex">
          <div class="block">
            <h2>Placement Info</h2>
            <div v-for="result in item.results">
              Choice {{ result.ChoiceRank }}: {{ result.School }} #{{
                result.adjustedRank
              }}
              on {{ result.lotteryList }}
            </div>
          </div>
          <div class="block ml-10">
            <h2>Parent Information</h2>
            {{ item.contact.ParentFirst }} {{ item.contact.ParentLast }}<br />
            {{ item.contact.ParentPhone }}<br />
            {{ item.contact.ParentEmail }}
          </div>
        </div>
      </template>
      <template #item-queueDate="{ queueDate }">
        {{ new Date(queueDate).toLocaleDateString() }}</template
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
      <template #header-list="header">
        <div class="filter-column">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 inline"
            @click.stop="showListFilter = !showListFilter"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          {{ header.text }}
          <div
            v-if="showListFilter"
            class="absolute top-10 left-1 z-10 w-40 p-3 bg-white rounded-lg shadow"
          >
            <ul class="text-left">
              <li v-for="(list, index) in lists">
                <input
                  :id="index"
                  type="checkbox"
                  v-model="listFilter"
                  :value="list"
                  class="w-4 h-4 bg-gray-300 rounded text-sm"
                />
                <label
                  :for="index"
                  class="ml-2 text-sm font-medium text-gray-900"
                  >{{ list }}</label
                >
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #item-list="{ lotteryList, queueStatus, confirmedEnrollment }">
        {{ lotteryList }}
        <span v-if="queueStatus"
          >(<em>{{ queueStatus }}</em
          >)</span
        >
        <span v-if="confirmedEnrollment"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="green"
            class="w-4 h-4 inline"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
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
