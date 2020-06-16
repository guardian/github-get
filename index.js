const fetch = require('node-fetch');
const path = require('path');
const showdown = require('showdown');
const { Liquid } = require('liquidjs');
const fs = require('fs');
const open = require('open');


const converter = new showdown.Converter();


var engine = new Liquid({
    root: path.resolve(__dirname),  // root for layouts/includes lookup
    extname: '.liquid'          // used for layouts/includes, defaults ""
});

const filterByDate = (json, duration) => {
    console.log(json)
   return json.filter(pr => {
        const date = new Date(pr.created_at)
        const dateNow = new Date();
        const oneDay = 1000*60*60*24;
        if ((dateNow - date) / oneDay < duration) {
            return pr;
        }
    })
}

const getDescriptions = json => 
    json.map(pr => ({
        body: converter.makeHtml(pr.body),
        created: pr.created_at,
        merged: pr.merged_at,
        title: pr.title,
        url: pr.html_url,
        repoName: pr.head.repo.name
    }))

const generateHtml = json => 
engine
    .renderFile("email", json)

module.exports = (duration, repoNames) => {
    Promise.all(repoNames.map(val => fetch(`https://api.github.com/repos/guardian/${val}/pulls?state=all`).then(res => res.json())))
    .then(res => {console.log(res); return res;})
    .then(res => res.reduce((prev, current) => prev.concat(current))) // Take all (json converted) response and combine them into one array 
    .then(json => filterByDate(json, duration))
    .then(getDescriptions)
    .then(json => ({ prs: json })) // convert to use in liquid
    .then(json => { console.log(json); return json}) // Just log
    .then(generateHtml) // pass to liquid template
    .then(html => fs.writeFile('email.html', html, e => console.log))
    .then(() => open('email.html'))
  .catch(e => console.log(e))
}
