import { ApiCheck, AssertionBuilder } from "checkly/constructs";

new ApiCheck("tool-page-check", {
  name: "ENNA Tool Page (Nmap)",
  request: {
    method: "GET",
    url: "https://www.en-na.com/tool/nmap",
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(3000),
    ],
  },
  tags: ["tools", "detail-page"],
});
