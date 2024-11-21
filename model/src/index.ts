import {
  BlockModel,
  type InferOutputsType,
  type InferHrefType,
  type PlDataTableState,
  type PlTableFiltersModel,
  type PColumnSpec,
  type ValueType,
  isPColumn,
  isPColumnSpec,
  mapJoinEntry
} from '@platforma-sdk/model';

export function getClonotypeColumnBlockId(spec: PColumnSpec): string | undefined {
  if (
    (spec.axesSpec.length === 3 &&
      spec.axesSpec[0].name === 'pl7.app/sampleId' &&
      spec.axesSpec[1].name === 'pl7.app/vdj/chain' &&
      spec.axesSpec[2].name === 'pl7.app/vdj/cloneId') ||
    (spec.axesSpec.length === 4 &&
      spec.axesSpec[0].name === 'pl7.app/sampleId' &&
      spec.axesSpec[1].name === 'pl7.app/vdj/chain' &&
      spec.axesSpec[2].name === 'pl7.app/vdj/cloneId' &&
      spec.axesSpec[3].name === 'pl7.app/vdj/tagValueCELL')
  )
    return spec.axesSpec[2]?.domain?.['pl7.app/blockId'];
  if (
    spec.axesSpec.length === 3 &&
    spec.axesSpec[0].name === 'pl7.app/sampleId' &&
    spec.axesSpec[1].name === 'pl7.app/vdj/cloneId' &&
    spec.axesSpec[2].name === 'pl7.app/vdj/tagValueCELL'
  )
    return spec.axesSpec[1]?.domain?.['pl7.app/blockId'];
  return undefined;
}

export type UiState = {
  settingsOpen: boolean;
  filtersOpen: boolean;
  filterModel: PlTableFiltersModel;
  inputBlockId?: string;
  tableState: PlDataTableState;
};

export const model = BlockModel.create('Heavy')
  .withArgs({})
  .withUiState<UiState>({
    settingsOpen: true,
    filtersOpen: false,
    filterModel: {},
    tableState: {
      gridState: {},
      pTableParams: {
        sorting: [],
        filters: []
      }
    }
  })
  .sections([{ type: 'link', href: '/', label: 'Browser' }])
  .output('inputOptions', (ctx) => {
    const collection = ctx.resultPool.getSpecs();
    if (collection === undefined) return undefined;

    const potentialBlocks = collection.entries
      .map(({ obj }) => obj)
      .filter(isPColumnSpec)
      .map(getClonotypeColumnBlockId)
      .filter((blockId): blockId is string => blockId !== undefined)
      .reduce((potentialBlocks, blockId) => {
        potentialBlocks.add(blockId);
        return potentialBlocks;
      }, new Set<string>());

    return [...potentialBlocks].map((blockId) => ({
      blockId,
      label: ctx.getBlockLabel(blockId)
    }));
  })
  .output('pFrame', (ctx) => {
    const collection = ctx.resultPool.getData();
    if (collection === undefined || !collection.isComplete) return undefined;

    const valueTypes = ['Int', 'Long', 'Float', 'Double', 'String', 'Bytes'] as ValueType[];
    const columns = collection.entries
      .map(({ obj }) => obj)
      .filter(isPColumn)
      .filter((column) => valueTypes.find((valueType) => valueType === column.spec.valueType));

    try {
      return ctx.createPFrame(columns);
    } catch (err) {
      return undefined;
    }
  })
  .output('pTable', (ctx) => {
    const join = ctx.uiState?.tableState.pTableParams?.join;
    if (!join) return undefined;

    const collection = ctx.resultPool.getData();
    if (!collection || !collection.isComplete) return undefined;

    const columns = collection.entries.map(({ obj }) => obj).filter(isPColumn);
    if (columns.length === 0) return undefined;

    let columnMissing = false;
    const src = mapJoinEntry(join, (idAndSpec) => {
      const column = columns.find((it) => it.id === idAndSpec.columnId);
      if (!column) columnMissing = true;
      return column!;
    });
    if (columnMissing) return undefined;

    return ctx.createPTable({
      src,
      filters: [
        ...(ctx.uiState.tableState.pTableParams?.filters ?? []),
        ...(ctx.uiState.filterModel?.filters ?? [])
      ],
      sorting: ctx.uiState.tableState.pTableParams?.sorting ?? []
    });
  })
  .done();

export type BlockOutputs = InferOutputsType<typeof model>;

export type NavigationHref = InferHrefType<typeof model>;
