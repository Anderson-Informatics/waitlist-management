<template>
  <div class="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
    <img
      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
    />
    <div
      class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
    >
      <div
        class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        style="
          clip-path: polygon(
            74.1% 44.1%,
            100% 61.6%,
            97.5% 26.9%,
            85.5% 0.1%,
            80.7% 2%,
            72.5% 32.5%,
            60.2% 62.4%,
            52.4% 68.1%,
            47.5% 58.3%,
            45.2% 34.5%,
            27.5% 76.7%,
            0.1% 64.9%,
            17.9% 100%,
            27.6% 76.8%,
            76.1% 97.7%,
            74.1% 44.1%
          );
        "
      />
    </div>
    <div
      class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
    >
      <div
        class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        style="
          clip-path: polygon(
            74.1% 44.1%,
            100% 61.6%,
            97.5% 26.9%,
            85.5% 0.1%,
            80.7% 2%,
            72.5% 32.5%,
            60.2% 62.4%,
            52.4% 68.1%,
            47.5% 58.3%,
            45.2% 34.5%,
            27.5% 76.7%,
            0.1% 64.9%,
            17.9% 100%,
            27.6% 76.8%,
            76.1% 97.7%,
            74.1% 44.1%
          );
        "
      />
    </div>
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Waitlist Management
        </h2>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Your "function-first/user-interface-later" home for managing the
          complexities of adjusting our application schools placement results.
        </p>
      </div>
      <div
        class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
      >
        <div
          v-for="card in cards"
          :key="card.name"
          class="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10"
        >
          <NuxtLink :href="card.href">
            <component
              :is="card.icon"
              class="h-7 w-5 flex-none text-indigo-400"
              aria-hidden="true"
            />
            <div class="text-base leading-7">
              <h3 class="font-semibold text-white">{{ card.name }}</h3>
              <p class="mt-2 text-gray-300">{{ card.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  TicketIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/vue/20/solid";

const cards = [
  {
    name: "Submissions",
    description: "View all submissions and essential application data.",
    icon: ClipboardDocumentListIcon,
    href: "submissions",
  },
  {
    name: "Placement Results",
    description:
      "Main page for checking and making adjustments to placement results.",
    icon: TicketIcon,
    href: "placements",
  },
  {
    name: "Pending Offer Queue",
    description:
      "Your base for making phone calls to families to make offers off of the waitlist.",
    icon: TicketIcon,
    href: "queue",
  },
  {
    name: "Activity Log",
    description: "Under Construction...",
    icon: NewspaperIcon,
    href: "#",
  },
];
</script>
