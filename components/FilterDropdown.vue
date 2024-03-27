<template>
  <div class="relative flex items-center px-4">
    <button @click="show = !show" class="flex items-center justify-center py-2 px-4 text-md rounded-md focus:outline-gray-600 outline outline-gray-200">
      Filter
    </button>
    <div v-if="show" class="absolute top-12 right-0 z-10 w-48 p-3 bg-white rounded-lg shadow">
      <h6 class="">Grade</h6>
      <ul class="">
        <li v-for="(grade, index) in grades">
          <input :id="`filter_option_${index}`" @change="filter" type="checkbox" :value="grade" class="w-4 h-4 bg-gray-300 rounded text-sm">
          <label :for="`filter_option_${index}`" class="ml-2 text-sm font-medium text-gray-900">{{ grade }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const show = ref(false);

const emit = defineEmits(['filter']);

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const grades = computed( () => {
  return [...new Set(props.items.map(item => item.grade))];
});

const filter = (e) => {
  emit('filter', e.target.value)
};
</script>