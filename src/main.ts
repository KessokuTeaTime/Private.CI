import * as core from "@actions/core";
import * as http from "@actions/http-client";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export async function run(): Promise<void> {
  // Parameters

  const auth = core.getInput("auth").trim();
  const endpoint = core.getInput("endpoint").trim();
  const payload = JSON.parse(core.getInput("payload").trim());

  // Validations

  let url = URL.parse(
    `https://kessokuteatime.work/${endpoint.replace(/^\//, "")}`
  );
  if (!url) throw new Error(`Invalid endpoint provided: ${endpoint}`);
  if (!payload) throw new Error(`Invalid JSON payload provided: ${payload}`);

  // Actions

  const client = new http.HttpClient("kessoku-private-ci");
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    "User-Agent": "kessoku-private-ci",
  };
  const body = JSON.stringify(payload);

  core.info(`Posting a request to ${endpoint} with payload ${body}…`);
  await client.post(endpoint, body, headers).then((response) => {
    const statusCode: StatusCodes =
      response.message.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

    if (statusCode == StatusCodes.OK) {
      core.info(`Successfully posted request to ${endpoint}`);
    } else {
      core.setFailed(
        `Failed to post request to ${endpoint}! Server responded with ${statusCode} ${getReasonPhrase(
          statusCode
        )}`
      );
    }
  });
  client.dispose();
}
