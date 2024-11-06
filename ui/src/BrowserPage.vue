<script setup lang="ts">
import { useApp } from './app';
import { computed } from 'vue';
import { PlBlockPage, PlBtnGhost, PlSlideModal, PlAgDataTable, PlDataTableSettings, PlDropdown } from '@platforma-sdk/ui-vue';
import {
  model,
  type UiState,
  getClonotypeColumnBlockId
} from '@platforma-open/milaboratories.clonotype-browser.model';
import * as lodash from 'lodash';
import { computedAsync } from '@vueuse/core';
import {
  getAxesId,
  mapJoinEntry,
  type AxesId,
  type ColumnJoinEntry,
  type FullJoin,
  type JoinEntry,
  type PColumnIdAndSpec
} from '@platforma-sdk/model';

const app = useApp();

const uiState = app.createUiModel<UiState>(undefined, () => ({
  settingsOpen: true,
  tableState: {
    gridState: {},
    pTableParams: {
      sorting: [],
      filters: []
    }
  }
}));

const pfDriver = model.pFrameDriver;
const pFrame = computed(() => app.model.outputs.pFrame);

const inputOptions = computed(
  () =>
    app.model.outputs.inputOptions?.map((v) => ({
      text: v.label,
      value: v.blockId
    })) ?? []
);

const inputBlockId = computed({
  get: () => uiState.model.inputBlockId,
  set: (inputBlockId) => {
    uiState.model.inputBlockId = inputBlockId;
    if (!inputBlockId) {
      uiState.model.tableState = {
        gridState: {},
        pTableParams: {
          sorting: [],
          filters: []
        }
      };
    }
  }
});

const join = computedAsync(async () => {
  const pFrameHandle = pFrame.value;
  if (!pFrameHandle) return undefined;

  const blockId = uiState.model.inputBlockId;
  if (!blockId) return undefined;

  const columns = await pfDriver.listColumns(pFrame.value);
  const clonotypeColumns = columns.filter(
    (column) => getClonotypeColumnBlockId(column.spec) === blockId
  );
  if (!clonotypeColumns.length) return undefined;

  return {
    type: 'full',
    entries: clonotypeColumns.map(
      (column) =>
      ({
        type: 'column',
        column
      } satisfies ColumnJoinEntry<PColumnIdAndSpec>)
    )
  } satisfies FullJoin<PColumnIdAndSpec>;
});

function getColumnsFromJoin(join: JoinEntry<PColumnIdAndSpec>): PColumnIdAndSpec[] {
  const columns: PColumnIdAndSpec[] = [];
  mapJoinEntry(join, (idAndSpec) => {
    columns.push(idAndSpec);
    return idAndSpec;
  });
  return columns;
}

const sheetAxes = computed(() => {
  const joinValue = join.value;
  if (!joinValue) return [];

  const columns = getColumnsFromJoin(joinValue);
  const axes = getAxesId(columns[0].spec.axesSpec).map(lodash.cloneDeep);

  const ret = [
    axes.find((axis) => axis.name === 'pl7.app/sampleId')!
  ] satisfies AxesId;

  const chainAxis = axes.find((axis) => axis.name === 'pl7.app/vdj/chain')
  if (chainAxis) ret.push(chainAxis)

  return ret;
});

const tableState = computed({
  get: () => uiState.model.tableState,
  set: (tableState) => {
    if (!lodash.isEqual(tableState, uiState.model.tableState)) {
      uiState.model.tableState = tableState;
    }
  }
});
const tableSettings = computed(
  () =>
  ({
    sourceType: 'pframe',
    pFrame: app.model.outputs.pFrame,
    join: join.value,
    sheetAxes: sheetAxes.value,
    pTable: app.model.outputs.pTable,
  } satisfies PlDataTableSettings)
);
</script>

<template>
  <PlBlockPage>
    <template #title>Clonotype Browser</template>
    <template #append>
      <PlBtnGhost :icon="'settings-2'" @click.stop="() => uiState.model.settingsOpen = true">
        Settings
      </PlBtnGhost>
    </template>
    <div style="flex: 1">
      <PlAgDataTable v-model="tableState" :settings="tableSettings" />
    </div>
  </PlBlockPage>
  <PlSlideModal v-model="uiState.model.settingsOpen" :shadow="true" :close-on-outside-click="true">
    <template #title>Settings</template>
    <PlDropdown :options="inputOptions" v-model="inputBlockId" label="Select dataset" clearable />
  </PlSlideModal>
</template>
