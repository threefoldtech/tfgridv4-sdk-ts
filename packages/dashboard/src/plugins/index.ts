/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import { createPinia } from "pinia";
import "vue3-toastify/dist/index.css";
import Vue3Toasity from "vue3-toastify";
 

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(Vue3Toasity);
  app.use(createPinia());
  app.use(vuetify);
}
