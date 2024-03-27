<script setup>
const submissions = useSubmissions();
const route = useRoute();
const submission = computed(() => {
  return submissions.find(
    (submission) => submission.submissionId === route.params.submissionId
  );
});
// This will just throw a more palatable 404 error when submission id route not found
if (!submission.value) {
  throw createError({
    statusCode: 404,
    message: "Submission not found",
  });
}
const title = computed(() => {
  return `Submission - ${submission.value.FullName}`;
});
useHead({
  title,
});
</script>

<template>
  <div class="m-10">
    Submission Page {{ $route.params.submissionId }} <br />
    <h1 class="font-bold text-2xl">{{ submission.FullName }}</h1>
    <p>DOB: {{ submission.DOB }}</p>

    <h2 class="font-bold text-xl mt-4">School Rankings</h2>
    <hr class="bg-gray-400 my-2 h-[2px]" />
    <p>
      <span class="text-sm text-slate-500">First-Choice:</span>
      {{ submission.FirstChoiceSchool }}
    </p>
    <p>
      <span class="text-sm text-slate-500">Second-Choice:</span>
      {{ submission.SecondChoiceSchool }}
    </p>
    <p>
      <span class="text-sm text-slate-500">Third-Choice:</span>
      {{ submission.ThirdChoiceSchool }}
    </p>

    <slot />
  </div>
</template>
