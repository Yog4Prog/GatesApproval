const core = require('@actions/core');
const github = require('@actions/github');

const octokit = new Octokit({
    auth: core.getInput('secret')
})

try {

  await octokit.request('POST /repos/Yog4Prog/GatesApproval/issues', {
    owner: 'Yog4Prog',
    repo: 'GatesApproval',
    title: 'Approve an Issue',
    body: 'Found a bug need approval to ontinue',
    assignees: [
      'Yog4Prog'
    ],
    labels: [
      'bug'
    ]
  })
} catch (error) {
  core.setFailed(error.message);
}

