<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-100">
    <body class="h-full">
    ```
  -->
  <div class="min-h-full">
    <NuxtLoadingIndicator />
    <NavBar />
    <!-- <PageTitle /> -->
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>
