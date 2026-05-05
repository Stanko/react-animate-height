import cypress from 'cypress';
import { context } from 'esbuild';



async function main() {
  let exitCode = 1;
  let serverContext;

  try {
    serverContext = await context({
      entryPoints: ['test/test.tsx', 'test/test.css'],
      bundle: true,
      tsconfig: 'tsconfig-demo.json',
      outdir: 'test/output',
    });

    const server = await serverContext.serve({
      port: 8080,
      servedir: 'test',
    });

    console.log(`Test server listening on port ${server.port}`);

    const result = await cypress.run();

    if ('status' in result && result.status === 'failed') {
      console.error(result.message);
      exitCode = result.failures > 0 ? 1 : 0;
    } else {
      exitCode = result.totalFailed > 0 ? 1 : 0;
    }
  } catch (error) {
    console.error(error);
    exitCode = 1;
  } finally {
    if (serverContext) {
      await serverContext.dispose();
    }
  }

  return exitCode;
}

main().then((exitCode) => {
  process.exit(exitCode);
});
