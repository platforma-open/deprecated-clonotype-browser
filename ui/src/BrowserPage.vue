<script setup lang="ts">
import { useApp } from './app';
import { PlDropdown } from '@milaboratories/uikit';
import { computed } from 'vue';
import { PlAgDataTable, PlDataTableSettings } from '@platforma-sdk/ui-vue';
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
  tableState: {
    gridState: {},
    pTableParams: {
      sorting: [],
      filters: []
    }
  }
}));

const pfDriver = model.pFrameDriver;
const pFrame = computed(() => app.outputValues.pFrame);

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

  return [
    axes.find((axis) => axis.name === 'pl7.app/sampleId')!,
    axes.find((axis) => axis.name === 'pl7.app/vdj/chain')!
  ] satisfies AxesId;
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
      pFrame: app.outputs.pFrame,
      join: join.value,
      sheetAxes: sheetAxes.value,
      pTable: app.outputs.pTable
    } satisfies PlDataTableSettings)
);
</script>

<template>
  <div class="box">
    <div class="container">
      <form class="settings-form">
        <PlDropdown
          :options="inputOptions"
          v-model="inputBlockId"
          label="Select dataset"
          clearable
        />
      </form>
      <div class="table-container">
        <PlAgDataTable v-model="tableState" :settings="tableSettings" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  margin: 12px;
  min-width: 760px;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
}
.settings-form {
  margin-top: 6px;
  z-index: 1;
}
.table-container {
  flex: 1;
  z-index: 0;
}
</style>
