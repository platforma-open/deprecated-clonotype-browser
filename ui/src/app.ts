import { model } from '@platforma-open/milaboratories.clonotype-browser.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import BrowserPage from './pages/BrowserPage.vue';

export const sdkPlugin = defineApp(model, () => {
  return {
    routes: {
      '/': () => BrowserPage
    }
  };
});

export const useApp = sdkPlugin.useApp;
