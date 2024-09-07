import { platforma } from '@milaboratory/milaboratories.clone-browser.model';
import { defineApp } from '@milaboratory/sdk-vue';
import BrowserPage from './BrowserPage.vue';

export const sdkPlugin = defineApp(platforma, () => {
  return {
    routes: {
      '/': BrowserPage
    }
  };
});

export const useApp = sdkPlugin.useApp;
