import { ApiCheck, AssertionBuilder } from "checkly/constructs";

new ApiCheck("sitemap-check", {
  name: "ENNA Sitemap",
  request: {
    method: "GET",
    url: "https://www.en-na.com/sitemap.xml",
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(3000),
    ],
  },
  tags: ["seo", "sitemap"],
});
