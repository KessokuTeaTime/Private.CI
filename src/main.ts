import * as core from "@actions/core";
import * as http from "@actions/http-client";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export async function run(): Promise<void> {
  // Parameters

  const dest = core.getInput("dest").trim();
  const auth = core.getInput("auth").trim();
  const endpoint = core.getInput("endpoint").trim();
  const run_id = core.getInput("github_run_id").trim();

  // Validations

  if (!URL.canParse(endpoint)) throw new Error("Invalid endpoint provided");
  if (run_id == "") throw new Error("Invalid workflow run id provided");

  // Actions

  const client = new http.HttpClient("kessoku-private-ci");
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    "User-Agent": "kessoku-private-ci",
  };
  const body = JSON.stringify({ run_id: run_id });

  core.info(`Posting with run id ${run_id}…`);
  return await client.post(endpoint, body, headers).then((response) => {
    const statusCode: StatusCodes =
      response.message.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

    if (statusCode == StatusCodes.OK) {
      core.info(`Successfully started website deployment at ${dest}`);
    } else {
      core.setFailed(
        `Failed to deploy! Server responded with ${statusCode} ${getReasonPhrase(
          statusCode
        )}`
      );
    }
  });
}
