import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWSMock from "aws-sdk-mock";
import { expect } from "chai";
import LambdaTester from "lambda-tester";
import { emailSender } from "../src/handler";

const mockEvent = (options: Record<string, any>) =>
  (({
    body: null,
    headers: { Origin: "http://localhost:3000" },
    ...options
  } as unknown) as APIGatewayProxyEvent);

const failedResponse = {
  statusCode: 503,
  body: JSON.stringify({ message: "fail" })
};

const successfulResponse = {
  statusCode: 200,
  body: JSON.stringify({ message: "success" }),
  headers: { "Access-Control-Allow-Origin": "http://localhost:3000" }
};

describe("emailSender", () => {
  it("should fail if origin is unknown", async () => {
    await LambdaTester(emailSender)
      .event(mockEvent({ headers: { Origin: "http://foo.com" } }))
      .expectResult((result: Record<string, any>) => {
        expect(result).to.deep.equal(failedResponse);
      });
  });

  it("should fail if unknown fields are provided", async () => {
    await LambdaTester(emailSender)
      .event(mockEvent({ body: JSON.stringify({ someWeirdField: "value" }) }))
      .expectResult((result: Record<string, any>) => {
        expect(result).to.deep.equal(failedResponse);
      });
  });

  it("should succeed", async () => {
    AWSMock.mock("SES", "sendEmail", {});

    await LambdaTester(emailSender)
      .event(mockEvent({ body: JSON.stringify({ name: "John Doe" }) }))
      .expectResult((result: Record<string, any>) => {
        expect(result).to.deep.equal(successfulResponse);
      });
  });
});
