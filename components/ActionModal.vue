<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckIcon
                    class="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base text-center font-semibold leading-6 text-gray-900"
                    >Placement Result Update Form</DialogTitle
                  >
                  <div class="mt-2 text-left">
                    <h4 class="text-lg">
                      {{ props.result.FirstName }} {{ props.result.LastName }}
                    </h4>
                    <p>Grade: {{ props.result.Grade }}</p>
                    <p class="mt-3 mb-3">
                      Placement for {{ props.result.School }}:
                      <br />
                      <strong>{{ props.result.lotteryList }}</strong>
                    </p>
                    <div class="w-full mb-6 md:mb-0">
                      <div class="relative">
                        <select
                          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          label="Please select an action"
                          v-model="action"
                        >
                          <option class="hidden">
                            Please select an action
                          </option>
                          <option>Remove from Offer/Waiting List</option>
                          <option>
                            Future options for other actions here...
                          </option>
                        </select>
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                        ></div>
                      </div>
                    </div>
                    <textarea
                      type="text"
                      label="Notes"
                      placeholder="Please describe the reason for the change..."
                      class="mt-3 block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      v-model="notes"
                    />
                  </div>
                  <div v-if="pending">
                    <p class="mt-6 text-lg text-gray-700">Pending changes:</p>
                    <ol class="text-left list-decimal list-inside mt-2 mb-4">
                      <li v-for="(change, index) in props.changes" class="mb-2">
                        {{ change }}
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  @click="runAction()"
                >
                  {{ props.button }}
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  @click="
                    $emit('close-modal');
                    action = 'Please select an action';
                    notes = '';
                  "
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  result: {
    type: Object,
  },
  open: {
    type: Boolean,
  },
  changes: {
    type: Array,
  },
  pending: {
    type: Boolean,
  },
  button: {
    type: String,
  },
});

const emit = defineEmits(["close-modal", "run-action"]);

const action = ref("Please select an action");
const notes = ref("");

const runAction = () => {
  emit("run-action", {
    action: action.value,
    stage: props.button,
    _id: props.result._id,
    submissionId: props.result.submissionId,
    FirstName: props.result.FirstName,
    LastName: props.result.LastName,
    School: props.result.School,
    SchoolID: props.result.SchoolID,
    Grade: props.result.Grade,
    lotteryList: props.result.lotteryList,
    newLotteryList: "Declined Offer",
    adjustedRank: props.result.adjustedRank,
    notes: notes.value,
  });
  // This will hopefully reset the form after submission
  if (props.button === "Submit Changes") {
    action.value = "Please select an action";
    notes.value = "";
  }
};
</script>
