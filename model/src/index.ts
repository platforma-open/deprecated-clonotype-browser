import {
  BlockModel,
  InferHrefType,
  Option,
  Ref,
  isPColumn,
  isPColumnSpec,
  type InferOutputsType
} from '@milaboratory/sdk-ui';

export const platforma = BlockModel.create<{}>('Heavy')

  .initialArgs({})

  .output('inputOptions', (ctx) => [] as Option[])

  // .output('preset', (ctx) =>
  //   ctx.prerun
  //     ?.resolve({ field: 'preset', assertFieldType: 'Input', allowPermanentAbsence: true })
  //     ?.getDataAsJson<any>()
  // )

  // .output('qc', (ctx) =>
  //   parseResourceMap(ctx.outputs?.resolve({ field: 'qc', assertFieldType: 'Input' }), (acc) =>
  //     acc.getFileHandle()
  //   )
  // )

  // .output('reports', (ctx) =>
  //   parseResourceMap(ctx.outputs?.resolve({ field: 'reports', assertFieldType: 'Input' }), (acc) =>
  //     acc.getFileHandle()
  //   )
  // )

  // .output('logs', (ctx) => {
  //   return ctx.outputs !== undefined
  //     ? parseResourceMap(ctx.outputs?.resolve({ field: 'logs', assertFieldType: 'Input' }), (acc) =>
  //         acc.getLogHandle()
  //       )
  //     : undefined;
  // })

  // .output('progress', (ctx) => {
  //   return ctx.outputs !== undefined
  //     ? parseResourceMap(ctx.outputs?.resolve({ field: 'logs', assertFieldType: 'Input' }), (acc) =>
  //         acc.getProgressLog(ProgressPrefix)
  //       )
  //     : undefined;
  // })

  // .output('done', (ctx) => {
  //   return ctx.outputs !== undefined
  //     ? parseResourceMap(
  //         ctx.outputs?.resolve({ field: 'clns', assertFieldType: 'Input' }),
  //         (acc) => true
  //       ).data.map((e) => e.key[0] as string)
  //     : undefined;
  // })

  // .output('clones', (ctx) => {
  //   const collection = ctx.outputs
  //     ?.resolve({ field: 'clones', assertFieldType: 'Input' })
  //     ?.parsePObjectCollection();
  //   if (collection === undefined) return undefined;
  //   // if (collection === undefined || !collection.isComplete) return undefined;
  //   const pColumns = Object.entries(collection)
  //     .map(([id, obj]) => obj)
  //     .filter(isPColumn);
  //   return ctx.createPFrame(pColumns);
  // })

  // .output('inputOptions', (ctx) => {
  //   const spectFromPool = ctx.resultPool.getSpecsFromResultPool();
  //   return ctx.resultPool
  //     .getSpecsFromResultPool()
  //     .entries.filter((v) => {
  //       if (!isPColumnSpec(v.obj)) return false;
  //       const domain = v.obj.domain;
  //       return (
  //         v.obj.name === 'pl7.app/sequencing/data' &&
  //         (v.obj.valueType as string) === 'File' &&
  //         domain !== undefined &&
  //         (domain['pl7.app/fileExtension'] === 'fastq' ||
  //           domain['pl7.app/fileExtension'] === 'fastq.gz')
  //       );
  //     })
  //     .map(
  //       (v) =>
  //         ({
  //           ref: v.ref,
  //           label: `${ctx.getBlockLabel(v.ref.blockId)} / ${
  //             v.obj.annotations?.['pl7.app/label'] ?? `unlabelled`
  //           }`
  //         } satisfies Option)
  //     );
  // })

  // .output('sampleLabels', (ctx) => {
  //   const inputRef = ctx.args.input;
  //   if (inputRef === undefined) return undefined;
  //   // @todo implement getSpecByRef method
  //   const inputSpec = ctx.resultPool
  //     .getSpecsFromResultPool()
  //     .entries.find(
  //       (obj) => obj.ref.blockId === inputRef.blockId && obj.ref.name === inputRef.name
  //     )?.obj;
  //   if (inputSpec === undefined || !isPColumnSpec(inputSpec)) return undefined;
  //   const sampleAxisSpec = inputSpec.axesSpec[0];

  //   // @todo implement get by spec
  //   const sampleLabelsObj = ctx.resultPool.getDataFromResultPool().entries.find((f) => {
  //     const spec = f.obj.spec;
  //     if (!isPColumnSpec(spec)) return false;
  //     if (spec.name !== 'pl7.app/label' || spec.axesSpec.length !== 1) return false;
  //     const axisSpec = spec.axesSpec[0];
  //     if (axisSpec.name !== sampleAxisSpec.name) return false;
  //     if (sampleAxisSpec.domain === undefined || Object.keys(sampleAxisSpec.domain).length === 0)
  //       return true;
  //     if (axisSpec.domain === undefined) return false;
  //     for (const [domainName, domainValue] of Object.entries(sampleAxisSpec.domain))
  //       if (axisSpec.domain[domainName] !== domainValue) return false;
  //     return true;
  //   });

  //   if (sampleLabelsObj === undefined) return undefined;

  //   // if (sampleLabelsObj.obj.data.resourceType.name !== 'PColumn/Json') return undefined;

  //   return Object.fromEntries(
  //     Object.entries(sampleLabelsObj.obj.data.getDataAsJson<Record<string, string>>()).map((e) => [
  //       JSON.parse(e[0])[0],
  //       e[1]
  //     ])
  //   ) satisfies Record<string, string>;
  // })

  .sections((ctx) => {
    return [{ type: 'link', href: '/', label: 'Browser' }];
  })

  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
export type Href = InferHrefType<typeof platforma>;
