<script></script>
<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div class="flex min-h-full flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2
            class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Sign in to your account
          </h2>
        </div>

        <div class="mt-10">
          <div>
            <form action="#" method="POST" class="space-y-6">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Email address</label
                >
                <div class="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Password</label
                >
                <div class="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm leading-6">
                  <a
                    href="#"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >Forgot password?</a
                  >
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>

          <div class="mt-10">
            <div class="relative">
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-gray-200" />
              </div>
              <div
                class="relative flex justify-center text-sm font-medium leading-6"
              >
                <span class="bg-white px-6 text-gray-900"
                  >Or continue with</span
                >
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-4">
              <a
                href="#"
                class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                >
                  <title>MS-SymbolLockup</title>
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span class="text-sm font-semibold leading-6"
                  >Sign in with Microsoft</span
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
