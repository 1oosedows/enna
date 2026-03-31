import { ApiCheck, AssertionBuilder } from "checkly/constructs";

new ApiCheck("homepage-check", {
  name: "ENNA Homepage",
  request: {
    method: "GET",
    url: "https://www.en-na.com",
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(3000),
    ],
  },
  tags: ["homepage", "critical"],
});
