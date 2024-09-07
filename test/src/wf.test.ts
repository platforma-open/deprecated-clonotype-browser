import {
  BlockArgs,
  BlockOutputs,
  platforma,
  uniquePlId
} from '@milaboratory/milaboratories.clone-browser.model';
import { awaitStableState, blockTest } from '@milaboratory/sdk-test';
import { blockSpec as samplesAndDataBlockSpec } from '@milaboratory/milaboratories.samples-and-data';
import { BlockArgs as SamplesAndDataBlockArgs } from '@milaboratory/milaboratories.samples-and-data.model';
import { blockSpec as myBlockSpec } from 'this-block';
import { InferBlockState, fromPlRef, wrapOutputs } from '@milaboratory/sdk-ui';
import * as tp from 'node:timers/promises';

blockTest(
  'simple project',
  { timeout: 35000 },
  async ({ rawPrj: project, ml, helpers, expect }) => {
    // const sndBlockId = await project.addBlock('Samples & Data', samplesAndDataBlockSpec);
    // const clonotypingBlockId = await project.addBlock('MiXCR Clonotyping', myBlockSpec);

    // const sample1Id = uniquePlId();
    // const metaColumn1Id = uniquePlId();
    // const dataset1Id = uniquePlId();

    // const r1Handle = await helpers.getLocalFileHandle('./assets/small_data_R1.fastq.gz');
    // const r2Handle = await helpers.getLocalFileHandle('./assets/small_data_R2.fastq.gz');

    // project.setBlockArgs(sndBlockId, {
    //   metadata: [
    //     {
    //       id: metaColumn1Id,
    //       label: 'MetaColumn1',
    //       global: false,
    //       valueType: 'Long',
    //       data: {
    //         [sample1Id]: 2345
    //       }
    //     }
    //   ],
    //   sampleIds: [sample1Id],
    //   sampleLabelColumnLabel: 'Sample Name',
    //   sampleLabels: { [sample1Id]: 'Sample 1' },
    //   datasets: [
    //     {
    //       id: dataset1Id,
    //       label: 'Dataset 1',
    //       content: {
    //         type: 'Fastq',
    //         readIndices: ['R1', 'R2'],
    //         gzipped: true,
    //         data: {
    //           [sample1Id]: {
    //             R1: r1Handle,
    //             R2: r2Handle
    //           }
    //         }
    //       }
    //     }
    //   ]
    // } satisfies SamplesAndDataBlockArgs);
    // await project.runBlock(sndBlockId);
    // await helpers.awaitBlockDone(sndBlockId, 4000);
    // const sndBlockState = project.getBlockState(sndBlockId);
    // const clonotypingBlockState = project.getBlockState(clonotypingBlockId);

    // const sdnStableState1 = await helpers.awaitBlockDoneAndGetStableBlockState(sndBlockId);
    // expect(sdnStableState1.outputs).toMatchObject({
    //   fileImports: { ok: true, value: { [r1Handle]: { done: true }, [r2Handle]: { done: true } } }
    // });

    // const clonotypingStableState1 = (await awaitStableState(
    //   clonotypingBlockState,
    //   15000
    // )) as InferBlockState<typeof platforma>;

    // expect(clonotypingStableState1.outputs).toMatchObject({
    //   inputOptions: {
    //     ok: true,
    //     value: [
    //       {
    //         label: 'Samples & Data / Dataset 1'
    //       }
    //     ]
    //   }
    // });

    // const presets = wrapOutputs<BlockOutputs>(clonotypingStableState1.outputs).presets;
    // expect(presets).length.gt(10);

    // const clonotypingStableState1Outputs = wrapOutputs(clonotypingStableState1.outputs);

    // await project.setBlockArgs(clonotypingBlockId, {
    //   input: clonotypingStableState1Outputs.inputOptions[0].ref,
    //   preset: 'milab-human-dna-xcr-7genes-multiplex'
    // } satisfies BlockArgs);

    // const clonotypingStableState2 = (await awaitStableState(
    //   project.getBlockState(clonotypingBlockId),
    //   15000
    // )) as InferBlockState<typeof platforma>;

    // const outputs2 = wrapOutputs<BlockOutputs>(clonotypingStableState2.outputs);
    // // console.dir(outputs2.sampleLabels, { depth: 5 });
    // // console.log(JSON.stringify([sample1Id]));
    // expect(outputs2.sampleLabels[sample1Id]).toBeDefined();

    // await project.runBlock(clonotypingBlockId);
    // const clonotypingStableState3 = (await helpers.awaitBlockDoneAndGetStableBlockState(
    //   clonotypingBlockId,
    //   25000
    // )) as InferBlockState<typeof platforma>;
    // const outputs3 = wrapOutputs<BlockOutputs>(clonotypingStableState3.outputs);

    // // console.dir(clonotypingStableState3, { depth: 8 });

    // expect(outputs3.reports.isComplete).toEqual(true);

    // const alignJsonReportEntry = outputs3.reports.data.find(
    //   (e: any) => e.key[1] === 'align' && e.key[2] === 'json'
    // );

    // expect(alignJsonReportEntry).toBeDefined();

    // const alignJsonReport = JSON.parse(
    //   Buffer.from(
    //     await ml.driverKit.blobDriver.getContent(alignJsonReportEntry!.value!.handle)
    //   ).toString('utf8')
    // );

    // // console.dir(alignJsonReport, { depth: 5 });
    // expect(alignJsonReport.aligned).toBeDefined();
    // expect(alignJsonReport.aligned).greaterThan(2);

    // // console.dir(alignJsonReport, { depth: 5 });

    // const clonesPfHandle = wrapOutputs(clonotypingStableState3.outputs).clones!;

    // const clonesPfColumnList = await ml.driverKit.pFrameDriver.listColumns(clonesPfHandle);

    // expect(
    //   clonesPfColumnList[0].spec.axesSpec.find((s: any) => s.name === 'pl7.app/vdj/cloneId')
    // ).toMatchObject({
    //   domain: {
    //     'pl7.app/blockId': clonotypingBlockId
    //   }
    // });

    // // console.log(clonesPfColumnList);
    // expect(clonesPfColumnList).length.to.greaterThanOrEqual(7);

    // // console.dir(clonotypingStableState3, { depth: 8 });
  }
);
