import * as core from '@actions/core'
import * as http from '@actions/http-client'

const auth = core.getInput("auth");
const endpoint = core.getInput("endpoint");
const run_id = core.getInput("run-id");
if (URL.parse(endpoint) == null) {
    throw new Error('Invalid endpoint provided');
}
const httpClient = new http.HttpClient('kessoku-private-ci');
const headers = {
    'Authorization': `Basic ${auth}`,
    'User-Agent': 'kessoku-private-ci'
};
httpClient.post(endpoint, JSON.stringify({run_id: run_id}), headers).then(response => {
    if (response.message.statusCode == 200) {
        core.info("Successfully post the API!");
    } else {
        core.setFailed(`Action failed! Response status: ${response.message.statusCode}`);
    }
});