<script setup>
const pageTitle = (e) => {
  emit("pageTitle", e.target.value);
};
computed(() => {
  return "Layout Page Title";
});
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-lg font-semibold leading-6 text-gray-900">Dashboard</h1>
    </div>
  </header>
</template>
