<script setup lang="ts">
import { PlRef, plRefsEqual, PTableColumnSpec } from '@platforma-sdk/model';
import {
  PlAgDataTable,
  PlAgDataTableController,
  PlBlockPage,
  PlBtnGhost,
  PlDropdownRef,
  PlMaskIcon24,
  PlSlideModal,
  PlTableFilters,
  type PlDataTableSettings,
  PlAgDataTableToolsPanel
} from '@platforma-sdk/ui-vue';
import { computed, ref, watch } from 'vue';
import { useApp } from '../app';

const app = useApp();

/** UI state upgrader */ (() => {
  if ('filtersOpen' in app.model.ui) delete app.model.ui.filtersOpen;
  if (app.model.ui.filterModel === undefined) app.model.ui.filterModel = {};
})();

function setAnchorColumn(ref: PlRef | undefined) {
  app.model.ui.anchorColumn = ref;
  app.model.ui.title = !!ref ? app.model.outputs.inputOptions?.find((o) =>
      plRefsEqual(o.ref, ref)
    )?.label : undefined;
}

const tableSettings = computed<PlDataTableSettings | undefined>(() =>
  app.model.ui.anchorColumn
    ? {
        sourceType: 'ptable',
        pTable: app.model.outputs.pt,
        sheets: app.model.outputs.sheets
      }
    : undefined
);
const columns = ref<PTableColumnSpec[]>([]);
const tableInstance = ref<PlAgDataTableController>();
watch(
  () => tableInstance.value,
  (tableInstance) => tableInstance?.focusRow(["2E5ZL2G7JLUXDL7X2ZDUXX3H","IGH",90]),
  { once: true },
);
</script>

<template>
  <PlBlockPage>
    <template #title>
      Clonotype Browser{{ app.model.ui.title ? ` - ${app.model.ui.title}` : '' }}
    </template>
    <template #append>
      <PlAgDataTableToolsPanel>
        <PlTableFilters v-model="app.model.ui.filterModel" :columns="columns" />
      </PlAgDataTableToolsPanel>
      <PlBtnGhost @click.stop="() => tableInstance?.exportCsv()">
        Export
        <template #append>
          <PlMaskIcon24 name="export" />
        </template>
      </PlBtnGhost>
      <PlBtnGhost @click.stop="() => (app.model.ui.settingsOpen = true)">
        Settings
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>
    <div style="flex: 1">
      <PlAgDataTable
        v-model="app.model.ui.tableState"
        ref="tableInstance"
        :settings="tableSettings"
        show-columns-panel
        @columns-changed="(newColumns) => (columns = newColumns)"
      />
    </div>
  </PlBlockPage>
  <PlSlideModal v-model="app.model.ui.settingsOpen" :close-on-outside-click="true">
    <template #title>Settings</template>
    <PlDropdownRef
      :options="app.model.outputs.inputOptions"
      :model-value="app.model.ui.anchorColumn"
      @update:model-value="setAnchorColumn"
      label="Select dataset"
      clearable
    />
  </PlSlideModal>
</template>
