export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("click-outside", {
    mounted(el, binding) {
      el.__ClickOutsideHandler__ = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
      document.body.addEventListener("click", el.__ClickOutsideHandler__);
    },
    unmounted(el) {
      document.body.removeEventListener("click", el.__ClickOutsideHandler__);
    },
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      return {};
    },
  });
});
