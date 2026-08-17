import { describe, expect, it } from 'vitest';
import { createRunContext } from '../../packages/core/src/index.js';
import { FfmpegProbeAdapter } from '../../packages/ffmpeg-probe/src/index.js';

describe('@berryn/adapter-framework & @berryn/ffmpeg-probe', () => {
  it('runs FFmpeg probe adapter without throwing', async () => {
    const adapter = new FfmpegProbeAdapter();
    const context = createRunContext();

    const { value, diagnostics } = await adapter.inspectTarget(process.cwd(), context);
    expect(value.vertical).toBe('ffmpeg');
    expect(value.incumbentName).toBe('fluent-ffmpeg');
    expect(diagnostics).toBeDefined();
  });
});
