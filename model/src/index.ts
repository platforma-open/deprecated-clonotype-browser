import {
  BlockModel,
  InferHrefType,
  Option,
  PColumn,
  PObject,
  PObjectSpec,
  Ref,
  TreeNodeAccessor,
  isPColumn,
  isPColumnSpec,
  type InferOutputsType
} from '@milaboratory/sdk-ui';

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

export type UiState = { inputBlockId: string };

export const platforma = BlockModel.create<{}, { inputBlockId: string }>('Heavy')

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

  .output('table', (ctx) => {
    const blockId = ctx.uiState?.inputBlockId;
    if (blockId === undefined) return undefined;

    const columns = new Set<string>();
    for (const e of ctx.resultPool.getSpecsFromResultPool().entries) {
      const blockId = getClonotypeColumnBlockId(e.obj);
      if (blockId === undefined) continue;
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
      filters: [],
      sorting: []
    });
  })

  .sections((ctx) => {
    return [{ type: 'link', href: '/', label: 'Browser' }];
  })

  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
export type Href = InferHrefType<typeof platforma>;
