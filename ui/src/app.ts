import { platforma } from '@platforma-open/milaboratories.clonotype-browser.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import BrowserPage from './BrowserPage.vue';

export const sdkPlugin = defineApp(platforma, () => {
  return {
    routes: {
      '/': BrowserPage
    }
  };
});

export const useApp = sdkPlugin.useApp;
