<script setup lang="ts">
import { platforma } from '@milaboratory/milaboratories.clone-browser.model';
import { useApp } from './app';
import { PlDropdown, PlTextArea } from '@milaboratory/platforma-uikit';
import { computed, ref, watch } from 'vue';
import { asyncComputed, useTimeoutPoll } from '@vueuse/core';
import { AnyLogHandle } from '@milaboratory/sdk-ui';
import { PlAgDataTable, PlDataTableSettings } from '@milaboratory/sdk-vue';

const app = useApp();

const inputOptions = computed(() =>
  app.getOutputFieldOkOptional("inputOptions")?.map((v) => ({
    text: v.label,
    value: v.blockId
  }))
);

const uiState = app.createUiModel({}, () => ({}))

const tableSettings = computed<PlDataTableSettings>(() => ({
  sourceType: "pframe",

  pTable: app.outputs.table,

  sheets: [
    {
      id: "samples",
      axis: {
        type: "String",
        name: "pl7.app/sampleId",
      },
      options: app.outputValues.sampleLabels ?? [],
      // defaultValue: "TRA",
    },
    {
      id: "chains",
      axis: {
        name: "pl7.app/vdj/chain",
        type: "String",
      },
      options: [
        { text: "TRA", value: "TRA" },
        { text: "TRB", value: "TRB" },
        { text: "IGH", value: "IGH" },
        { text: "IGK", value: "IGK" },
        { text: "IGL", value: "IGL" },
      ],
      // defaultValue: "TRA",
    }
  ],
}));

</script>

<template>
  <div class="container">
    <pl-dropdown :options="inputOptions ?? []" v-model="uiState.model.inputBlockId" label="Select dataset" clearable />
    <PlAgDataTable v-model="uiState.model.tableState" :settings="tableSettings"></PlAgDataTable>
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
