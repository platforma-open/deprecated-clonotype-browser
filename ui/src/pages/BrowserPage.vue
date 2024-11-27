<script setup lang="ts">
import {
  PTableColumnSpec,
  Ref
} from '@platforma-sdk/model';
import {
  MaskIconName24,
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

const tableSettings = computed<PlDataTableSettings>(() => {
  return {
    sourceType: 'ptable',
    pTable: app.model.outputs.pt,
    sheets: app.model.outputs.sheets
  }
});

const hasFilters = computed<boolean>(
  () => (columns.value.length > 0 && (app.model.ui.filterModel.filters ?? []).length > 0)
);
const filterIconName = computed<MaskIconName24>(() => (hasFilters.value ? 'filter-on' : 'filter'));
const filterIconColor = computed(() =>
  (hasFilters.value ? { backgroundColor: 'var(--border-color-focus)' } : undefined)
);

/* @deprecated Migrate to SDK method when will be published */
function plRefsEqual(ref1: Ref, ref2: Ref) {
  return ref1.blockId === ref2.blockId && ref1.name === ref2.name;
}

function setAnchorColumn(ref: Ref | undefined) {
  app.model.ui.anchorColumn = ref;
  if (ref)
    app.model.ui.title = app.model.outputs.inputOptions?.find(o => plRefsEqual(o.ref, ref))?.label;
  else
    app.model.ui.title = undefined;
}

const columns = ref<PTableColumnSpec[]>([]);
const tableInstance = ref<PlAgDataTableController>();
</script>

<template>
  <PlBlockPage>
    <template #title>Clonotype Browser{{ app.model.ui.title ? ` - ${app.model.ui.title}` : '' }}</template>
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
    <PlDropdownRef :options="app.model.outputs.inputOptions" :model-value="app.model.ui.anchorColumn"
      @update:model-value="setAnchorColumn" label="Select dataset" clearable />
  </PlSlideModal>
</template>
