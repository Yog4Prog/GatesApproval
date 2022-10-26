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

var approvalContext = {};
var approvedWords = ["approved", "approve", "lgtm", "yes", "proceed"]
var deniedWords = ["denied", "deny", "reject", "rejected", "no"]
var timeTrigger = 0;
var timeDurationCheck = 0;

async function createApprovalIssue() {

    approvalContext.owner = `${owner}`;
    approvalContext.owner = `${repo}`;
    approvalContext.title = `${issue_title}`;
    approvalContext.body = `${body_message}`;
    approvalContext.assignees = `${assignees}`;
    approvalContext.labels = `${labels}`;
    approvalContext.runID = '';
    approvalContext.issueNumber = '';
    approvalContext.status = '';
    approvalContext.closedComments = '';

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
        url: `https://api.github.com/repos/${org}/${repo}/issues`,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        data: createIssuePayload
    };


    var resp = await axios(createIssueRequest)
        .then(res => {
            console.log("Github Approval Issue successfully created !!");
            approvalContext.issueNumber = res.data.number;
            approvalContext.status = res.data.state;
        })
        .catch(error => {
            console.log("Failed to create an Github Approval Issue." + error)
        });

}

async function updateApprovalIssueOnComments() {
    var commentListRequest = {
        method: 'GET',
        url: `https://api.github.com/repos/${org}/${repo}/issues/${approvalContext.issueNumber}/comments`,
        headers: {
            'Authorization': `Bearer  ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
    };

    var resp = await axios(commentListRequest)
        .then(async res => {
            if (res.data.length > 0) {
                if (approvedWords.includes(res.data[res.data.length - 1].body.toLowerCase())) {
                    console.log(`${assignees} Approved to proceed.`);
                    await closeIssue();
                }
                else if (deniedWords.includes(res.data[res.data.length - 1].body.toLowerCase())) {
                    console.log(`${assignees} Denied to proceed.`)
                    // Fail the build..
                    await closeIssue();
                }
                else {
                    console.log("No matching comments provided.. for Approve or Deny")
                }

            }
            else {
                console.log("Pending approval, awaiting ..");
            }
        })
        .catch(error => {
            console.log("Error Occured.." + error)
        });
}

async function closeIssue() {
    var closeIssuePayload = JSON.stringify(
        {
            owner: `${owner}`,
            repo: `${repo}`,
            state: 'closed'
        }
    );

    var closeIssueRequest = {
        method: 'PATCH',
        url: `https://api.github.com/repos/${org}/${repo}/issues/${approvalContext.issueNumber}`,
        headers: {
            'Authorization': `Bearer  ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        data: closeIssuePayload
    }

    var closeResp = await axios(closeIssueRequest).then(cresp => {
        console.log("Approval Request Closed!!")
        clearInterval(timeTrigger);
        clearTimeout(timeDurationCheck);
        timeTrigger = false;
    }).catch(cerror => {
        console.log("Exception occured " + cerror)
    })
}

async function main() {
    await createApprovalIssue();
    timeTrigger = setInterval(updateApprovalIssueOnComments, 5000);
    timeDurationCheck =  setTimeout(async function () {
            console.log("Approval waiting period elapsed. Approval request will be automatically closed and workflow status will be marked to Failed.")
            await closeIssue()
        }, timeout * 60 * 1000)
   
}

main()

