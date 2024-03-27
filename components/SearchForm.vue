<template>
  <form class="flex items-center"> 
    <label class="sr-only">Search</label>
    <div class="relative w-full">
      <input type="search" @input="search" placeholder="Search" class="p-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md text-sm">
    </div>
  </form>
</template>

<script setup>
const emit = defineEmits(['search']);
const search = (e) => {
  emit('search', e.target.value);
};
</script>