const core = require('@actions/core');
const github = require('@actions/github');
const axios = require("axios");


const owner = core.getInput('owner')
const org = core.getInput('org')
const repo = core.getInput('repo')
const assignees = core.getInput('approvers')
const token = core.getInput('secret')
const timeout = core.getInput('timeout')
const issue_title = core.getInput('issue_title')
const body_message = core.getInput('body_message')
const labels = core.getInput('labels')

async function createApprovalIssue() {

    
    console.log(`owner ${owner}`)
    console.log(`org ${org}`)
    console.log(`repo ${repo}`)
    console.log(`assignees ${assignees}`)
    console.log(`token ${token}`)
    console.log(`timeout ${timeout}`)
    console.log(`issue_title ${issue_title}`)
    console.log(`body_message ${body_message}`)
    console.log(`labels ${labels}`)
    
    var createIssuePayload = JSON.stringify(
        {
            owner: `${owner}`,
            repo: `${repo}`,
            title: `${issue_title}`,
            body: `${body_message}`,
            assignees: [
                `${assignees}`
            ],
            labels: [
                `${labels}`
            ]
        }
    );

    var createIssueRequest = {
        method: 'post',
        url: `https://api.github.com/repos/${owner}/${repo}/issues`,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        data: createIssuePayload
    };


    await axios(createIssueRequest)
        .then(function (res) {
            console.log("Github Approval Issue successfully created !!");
        })
        .catch(function (error) {
            console.log("Failed to create an Github Approval Issue." + error)
        });
}


createApprovalIssue()