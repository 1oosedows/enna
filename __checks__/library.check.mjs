import { ApiCheck, AssertionBuilder } from "checkly/constructs";

new ApiCheck("library-check", {
  name: "ENNA Library",
  request: {
    method: "GET",
    url: "https://www.en-na.com/library",
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(3000),
    ],
  },
  tags: ["library", "books"],
});
