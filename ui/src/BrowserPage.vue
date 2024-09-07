<script setup lang="ts">
import { platforma } from '@milaboratory/milaboratories.clone-browser.model';
import { useApp } from './app';
import { PlDropdown, PlTextArea } from '@milaboratory/platforma-uikit';
import { computed, ref, watch } from 'vue';
import { asyncComputed, useTimeoutPoll } from '@vueuse/core';
import { AnyLogHandle } from '@milaboratory/sdk-ui';

const app = useApp();

const inputOptions = computed(() =>
  app.getOutputFieldOkOptional("inputOptions")?.map((v) => ({
    text: v.label,
    value: v.ref,
  }))
);

</script>

<template>
  <div class="container">
    Hi!
  </div>
</template>

<style lang="css">
button {
  padding: 12px 0;
}

.container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: 24px;
}
</style>
