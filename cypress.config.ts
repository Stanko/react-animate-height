import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  allowCypressEnv: false,
  e2e: {},
});
