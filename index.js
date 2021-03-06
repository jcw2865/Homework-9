const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
function makePDF(data) {
    let options = { format: "Letter" };
    let pdf = require("html-pdf");
    let html = fs.readFileSync("index.html");
    data.style = fs.readFileSync("style.css");
    pdf
        .create(
            html.toString().replace(/\${([^}]*)}/g, (r, k) => data[k]),
            options
        )
        .toFile("./businesscard.pdf", function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
}
function promptUser() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "color",
                message: "What is your favorite color?"
            },
            {
                type: "input",
                name: "username",
                message: "What is your GitHub username?"
            }
        ])
        .then(function (data) {
            // Make a request for a user with a given ID
            axios
                .get(`https://api.github.com/users/${data.username}`)
                .then(function (response) {
                    const color = data.color;
                    // console.log(response.data);
                    data.name = response.data.name;
                    data.public_repos = response.data.public_repos;
                    data.followers = response.data.followers;
                    data.following = response.data.following;
                    data.avatar_url = response.data.avatar_url;
                    data.location = response.data.location;
                    const locationLink = "https://google.com/maps/places/" + data.location;
                    data.company = response.data.company;
                    data.bio = response.data.bio;
                    makePDF(data);
                });
        });
}
promptUser();
// need to use 'Promise'?