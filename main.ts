import * as core from '@actions/core'
import * as http from '@actions/http-client'

const auth = core.getInput("auth");
const endpoint = core.getInput("endpoint");
const run_id = core.getInput("run-id");
if (!URL.canParse(endpoint)) {
    throw new Error('Invalid endpoint provided');
}
const httpClient = new http.HttpClient('kessoku-private-ci');
const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
    'User-Agent': 'kessoku-private-ci'
};
const body = JSON.stringify({ run_id });
core.info(`Sending ${run_id}`);
httpClient.post(endpoint, JSON.stringify({run_id: run_id}), headers).then(response => {
    const statusCode = response.message.statusCode || 500;
    if (statusCode == 200) {
        core.info("Successfully post the API!");
    } else {
        core.setFailed(`Action failed! Response status: ${statusCode}`);
    }
});