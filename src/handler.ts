import { SES } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { ALLOWED_ORIGINS, normalizeHeaders, getEmailBodyHtml } from "./helpers";

export const emailSender: APIGatewayProxyHandler = async event => {
  const ses = new SES({ region: "eu-central-1" });

  try {
    const { origin } = normalizeHeaders(event.headers);

    if (!ALLOWED_ORIGINS.includes(origin)) {
      throw new Error(`Unknown origin: ${origin}`);
    }

    const { body } = event;
    const bodyObj = body ? JSON.parse(body) : {};

    const params = {
      Destination: { ToAddresses: [process.env.SES_DESTINATION_ADDRESS!] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: getEmailBodyHtml(bodyObj) } },
        Subject: {
          Data: "Новое обращение с сайта, дата: " + new Date().toString()
        }
      },
      Source: "marizamj@gmail.com"
    };

    await ses
      .sendEmail(params)
      .promise()
      .then(data => console.log("SES DATA: ", data));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "success" }),
      headers: { "Access-Control-Allow-Origin": origin }
    };
  } catch (error) {
    console.log("CATCHED ERROR: ", error);
    return {
      statusCode: 503,
      body: JSON.stringify({ message: "fail" })
    };
  }
};

module.exports.emailSender = emailSender;
