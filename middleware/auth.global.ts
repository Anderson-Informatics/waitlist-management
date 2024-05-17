export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  if (user.value || to.path === "/login") {
    return;
  }

  return navigateTo(`/login?redirectTo=${to.path}`);
});
