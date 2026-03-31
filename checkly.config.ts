import { defineConfig } from "checkly";

export default defineConfig({
  projectName: "ENNA",
  logicalId: "enna-project",
  repoUrl: "https://github.com/1oosedows/enna",
  checks: {
    frequency: 10,
    locations: ["us-east-1", "eu-west-1"],
    tags: ["enna", "production"],
    runtimeId: "2024.02",
    browserChecks: {
      testMatch: "**/__checks__/**/*.spec.ts",
    },
  },
  cli: {
    runLocation: "us-east-1",
  },
});
