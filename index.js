const core = require('@actions/core');
const github = require('@actions/github');
const axios = require("axios");


const owner = core.getInput('owner')
const repo = core.getInput('repo')
const assignees = core.getInput('approvers')
const token = core.getInput('secret')
const timeout = core.getInput('timeout')
const issue_title = core.getInput('issue-title')
const body_message = core.getInput('body_message')
const labels = core.getInput('lables')

var createPayload = JSON.stringify(
    {
        owner: owner,
        repo: repo,
        title: issue_title,
        body: body_message,
        assignees: [
            assignees
        ],
        labels: [
            labels
        ]
      }
);


var requestString = {
    method: 'post',
    url: `https://api.github.com/repos/${owner}/${repo}/issues`,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
    },
    data: createPayload
};


axios(requestString)
.then( function(res) {
    console.log("Issue successfully created !!");
})
.catch( function(error){
    console.log("Failed to created issue "+ error)
});
   
