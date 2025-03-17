import {
  AxisSpec,
  BlockModel,
  type InferHrefType,
  type InferOutputsType,
  type PColumnSpec,
  type PlDataTableState,
  PlRef,
  type PlTableFiltersModel,
  createPlDataTable,
  createPlDataTableSheet,
  getUniquePartitionKeys,
  isPColumn,
  isPColumnSpec
} from '@platforma-sdk/model';

/**
 * Get the cloneId axis (produced by the MiXCR Clonotyping block v1.x) from the column spec
 * @param spec - column spec
 * @returns the cloneId axis
 */
function getCloneIdAxis(spec: PColumnSpec): AxisSpec | undefined {
  return spec.axesSpec.find((ax) => ax.name === 'pl7.app/vdj/cloneId');
}

/**
 * Get the clonotypeKey axis (produced by the MiXCR Clonotyping block v2.x) from the column spec
 * @param spec - column spec
 * @returns the clonotypeKey axis
 */
function getCloneKeyAxis(spec: PColumnSpec): AxisSpec | undefined {
  return spec.axesSpec.find((ax) => ax.name === 'pl7.app/vdj/clonotypeKey');
}

export type UiState = {
  title?: string;
  settingsOpen: boolean;
  anchorColumn?: PlRef;
  filterModel: PlTableFiltersModel;
  tableState: PlDataTableState;
};

/**
 * Check whether the column is a CDR3 column from v1.x of the MiXCR Clonotyping block
 * @param spec - column spec
 * @returns true if the column is a CDR3 column from v1.x of the MiXCR Clonotyping block
 */
const isAnchorColV1 = (spec: PColumnSpec) =>
  spec.name === 'pl7.app/vdj/sequence' &&
  spec.domain?.['pl7.app/vdj/feature'] === 'CDR3' &&
  spec.domain?.['pl7.app/alphabet'] === 'nucleotide' &&
  spec.axesSpec.some((ax) => ax.name === 'pl7.app/vdj/cloneId');

/**
 * Check whether the column is a read count column from v2.x of the MiXCR Clonotyping block
 * @param spec - column spec
 * @returns true if the column is a read count column from v2.x of the MiXCR Clonotyping block
 */
const isAnchorColV2 = (spec: PColumnSpec) =>
  spec.axesSpec.length === 2 &&
  spec.axesSpec[0].name === 'pl7.app/sampleId' &&
  spec.axesSpec[1].name === 'pl7.app/vdj/clonotypeKey' &&
  spec.annotations?.['pl7.app/isAnchor'] === 'true';

export const model = BlockModel.create()
  .withArgs({})
  .withUiState<UiState>({
    settingsOpen: true,
    filterModel: {},
    tableState: {
      gridState: {}
    }
  })
  .sections((_) => [{ type: 'link', href: '/', label: 'Browser' }])

  .retentiveOutput('inputOptions', (ctx) => {
    return ctx.resultPool.getOptions((spec) => {
      if (!isPColumnSpec(spec)) return false;
      return isAnchorColV1(spec) || isAnchorColV2(spec);
    });
  })

  .output('sheets', (ctx) => {
    if (!ctx.uiState?.anchorColumn) return undefined;

    const anchor = ctx.resultPool.getPColumnByRef(ctx.uiState.anchorColumn);
    if (!anchor) return undefined;

    const r = getUniquePartitionKeys(anchor.data);
    if (!r) return undefined;
    return r.map((values, i) => createPlDataTableSheet(ctx, anchor.spec.axesSpec[i], values));
  })

  .output('pt', (ctx) => {
    const anchorColumn = ctx.uiState?.anchorColumn;
    if (!anchorColumn) return undefined;

    // wait until sheet filters are set
    const sheetFilters = ctx.uiState.tableState.pTableParams?.filters;
    if (!sheetFilters) return undefined;

    const anchorSpec = ctx.resultPool.getSpecByRef(anchorColumn);
    if (!anchorSpec || !isPColumnSpec(anchorSpec)) {
      return undefined;
    }

    const isV1 = isAnchorColV1(anchorSpec);
    const isV2 = isAnchorColV2(anchorSpec);

    if (!isV1 && !isV2) return undefined;

    const getAnchorCloneAxis = (spec: PColumnSpec) => {
      if (isV1) {
        return getCloneIdAxis(spec);
      } else if (isV2) {
        return getCloneKeyAxis(spec);
      }
    };

    const anchorCloneAxis = getAnchorCloneAxis(anchorSpec);

    if (!anchorCloneAxis) {
      return undefined;
    }

    const columns = ctx.resultPool
      .getData()
      .entries.map((o) => o.obj)
      .filter(isPColumn)
      .filter((col) => {
        if (!isPColumnSpec(col.spec)) return false;
        const cloneAxis = getAnchorCloneAxis(col.spec);
        if (!cloneAxis) return false;
        return isV1
          ? // for v1 wi only check block id of axis
            cloneAxis.domain?.['pl7.app/blockId'] === anchorCloneAxis.domain?.['pl7.app/blockId']
          : // for v2 we check clonotypeKey structure, column blockId and column chain
            cloneAxis.domain?.['pl7.app/vdj/clonotypeKey/structure'] ===
              anchorCloneAxis.domain?.['pl7.app/vdj/clonotypeKey/structure'] &&
              col.spec.domain?.['pl7.app/vdj/clonotypingRunId'] === anchorSpec.domain?.['pl7.app/vdj/clonotypingRunId'] &&
              col.spec.domain?.['pl7.app/chain'] === anchorSpec.domain?.['pl7.app/chain'];
      });

    return createPlDataTable(ctx, columns, ctx.uiState.tableState, {
      filters: ctx.uiState.filterModel?.filters
    });
  })

  .title((ctx) =>
    ctx.uiState?.title ? `Clonotype Browser - ${ctx.uiState?.title}` : 'Clonotype Browser'
  )

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;

export type NavigationHref = InferHrefType<typeof model>;
