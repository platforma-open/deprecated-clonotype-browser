<script setup lang="ts">
import {
  PTableColumnSpec
} from '@platforma-sdk/model';
import {
  PlAgDataTable,
  PlAgDataTableController,
  PlBlockPage,
  PlBtnGhost,
  PlDropdownRef,
  PlMaskIcon24,
  PlSlideModal,
  PlTableFilters,
  type PlDataTableSettings
} from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from '../app';

const app = useApp();

const tableSettings = computed(() => {
  return {
    sourceType: 'ptable',
    pTable: app.model.outputs.pt,
    sheets: app.model.outputs.sheets ?? []
  } satisfies PlDataTableSettings
});

const hasFilters = computed(
  () => columns.value.length > 0 && (app.model.ui.filterModel.filters ?? []).length > 0
);
const filterIconName = computed(() => (hasFilters.value ? 'filter-on' : 'filter'));
const filterIconColor = computed(() =>
  hasFilters.value ? { backgroundColor: 'var(--border-color-focus)' } : undefined
);


const columns = ref<PTableColumnSpec[]>([]);
const tableInstance = ref<PlAgDataTableController>();
</script>

<template>
  <PlBlockPage>
    <template #title>Clonotype Browser</template>
    <template #append>
      <PlBtnGhost @click.stop="() => tableInstance?.exportCsv()">
        Export
        <template #append>
          <PlMaskIcon24 name="export" />
        </template>
      </PlBtnGhost>
      <PlBtnGhost @click.stop="() => (app.model.ui.filtersOpen = true)">
        Filters
        <template #append>
          <PlMaskIcon24 :name="filterIconName" :style="filterIconColor" />
        </template>
      </PlBtnGhost>
      <PlBtnGhost @click.stop="() => app.model.ui.settingsOpen = true">
        Settings
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>
    <div style="flex: 1">
      <PlAgDataTable v-model="app.model.ui.tableState" :settings="tableSettings"
        @columns-changed="(newColumns) => columns = newColumns" ref="tableInstance" />
    </div>
  </PlBlockPage>
  <PlSlideModal v-model="app.model.ui.filtersOpen" :close-on-outside-click="true">
    <template #title>Filters</template>
    <PlTableFilters v-model="app.model.ui.filterModel" :columns="columns" />
  </PlSlideModal>
  <PlSlideModal v-model="app.model.ui.settingsOpen" :close-on-outside-click="true">
    <template #title>Settings</template>
    <PlDropdownRef :options="app.model.outputs.inputOptions" v-model="app.model.ui.anchorColumn" label="Select dataset"
      clearable />
  </PlSlideModal>
</template>
