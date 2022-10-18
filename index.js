const core = require('@actions/core');
const github = require('@actions/github');
const axios = require("axios");


const token = core.getInput('secret')

var createPayload = JSON.stringify(
    {
        owner: 'Yog4Prog',
        repo: 'GatesApproval',
        title: 'Approve an Issue 5',
        body: 'Found a bug need approval to ontinue',
        assignees: [
          'Yog4Prog'
        ],
        labels: [
          'bug'
        ]
      }
);


var requestString = {
    method: 'post',
    url: 'https://api.github.com/repos/Yog4Prog/GatesApproval/issues',
    headers: {
        'Authorization': 'Bearer '+token,
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
   
