import {
  AxisId,
  AxisSpec,
  BlockModel,
  InferHrefType,
  Option,
  PColumn,
  PObject,
  PObjectSpec,
  PlDataTableState,
  Ref,
  TreeNodeAccessor,
  isPColumn,
  isPColumnSpec,
  type InferOutputsType
} from '@platforma-sdk/model';

function getClonotypeColumnBlockId(spec: PObjectSpec): string | undefined {
  if (!isPColumnSpec(spec)) return undefined;
  if (
    spec.axesSpec.length !== 3 ||
    spec.axesSpec[0].name !== 'pl7.app/sampleId' ||
    spec.axesSpec[1].name !== 'pl7.app/vdj/chain' ||
    spec.axesSpec[2].name !== 'pl7.app/vdj/cloneId'
  )
    return undefined;
  return spec.axesSpec[2]?.domain?.['pl7.app/blockId'];
}

export type UiState = { inputBlockId?: string; tableState?: PlDataTableState };

export function axisMatch(query: AxisId, spec: AxisSpec): boolean {
  if (spec.name !== query.name || spec.type !== query.type) return false;
  if (query.domain === undefined) return true;
  for (const [domainKey, domainValue] of Object.entries(query.domain))
    if (spec.domain?.[domainKey] !== domainValue) return false;
  return true;
}

export const platforma = BlockModel.create<{}, UiState>('Heavy')

  .initialArgs({})

  .output('inputOptions', (ctx) => {
    const potentialBlocks = new Set<string>();
    for (const e of ctx.resultPool.getSpecsFromResultPool().entries) {
      const blockId = getClonotypeColumnBlockId(e.obj);
      if (blockId === undefined) continue;
      potentialBlocks.add(blockId);
    }

    return [...potentialBlocks].map((blockId) => ({
      blockId,
      label: ctx.getBlockLabel(blockId)
    }));
  })

  .output('sampleLabels', (ctx) => {
    const blockId = ctx.uiState?.inputBlockId;
    if (blockId === undefined) return undefined;

    let sampleAxisId: AxisId | undefined = undefined;
    for (const e of ctx.resultPool.getSpecsFromResultPool().entries) {
      if (!isPColumnSpec(e.obj)) return undefined;
      if (getClonotypeColumnBlockId(e.obj) !== blockId) continue;
      sampleAxisId = e.obj.axesSpec[0];
      break;
    }

    if (sampleAxisId === undefined) return undefined;

    const sampleLabelsObj = ctx.resultPool.getDataFromResultPool().entries.find((f) => {
      const spec = f.obj.spec;
      if (!isPColumnSpec(spec)) return false;
      if (spec.name !== 'pl7.app/label' || spec.axesSpec.length !== 1) return false;
      const axisSpec = spec.axesSpec[0];
      return axisMatch(sampleAxisId, axisSpec);
    });
    if (sampleLabelsObj === undefined) return undefined;

    return Object.entries(sampleLabelsObj.obj.data.getDataAsJson<Record<string, string>>()).map(
      (e) => ({ text: e[1], value: JSON.parse(e[0])[0] as string })
    );
  })

  .output('table', (ctx) => {
    const blockId = ctx.uiState?.inputBlockId;
    if (blockId === undefined) return undefined;

    const columns = new Set<string>();
    for (const e of ctx.resultPool.getSpecsFromResultPool().entries) {
      if (getClonotypeColumnBlockId(e.obj) !== blockId) continue;
      columns.add(`${e.ref.blockId}:${e.ref.name}`);
    }

    const data: PColumn<TreeNodeAccessor>[] = [];
    for (const e of ctx.resultPool.getDataFromResultPool().entries) {
      const refId = `${e.ref.blockId}:${e.ref.name}`;
      if (!columns.delete(refId)) continue;
      data.push(e.obj as PColumn<TreeNodeAccessor>);
    }
    if (columns.size !== 0) return undefined;
    return ctx.createPTable({
      src: { type: 'full', entries: data.map((o) => ({ type: 'column', column: o })) },
      filters: ctx.uiState?.tableState?.pTableParams?.filters ?? [],
      sorting: ctx.uiState?.tableState?.pTableParams?.sorting ?? []
    });
  })

  .sections((ctx) => {
    return [{ type: 'link', href: '/', label: 'Browser' }];
  })

  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
export type Href = InferHrefType<typeof platforma>;
