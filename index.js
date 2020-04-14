const fetch = require('node-fetch');
const path = require('path');
const showdown = require('showdown');
const { Liquid } = require('liquidjs');
const fs = require('fs');


const converter = new showdown.Converter();


var engine = new Liquid({
    root: path.resolve(__dirname),  // root for layouts/includes lookup
    extname: '.liquid'          // used for layouts/includes, defaults ""
});

const filterByDate = (json) => {
   return json.filter(pr => {
        const date = new Date(pr.created_at)
        const dateNow = new Date();
        const oneDay = 1000*60*60*24;
        if ((dateNow - date) / oneDay < 7) {
            return pr;
        }
    })
}

const getDescriptions = json => 
    json.map(pr => ({ body: converter.makeHtml(pr.body), created: pr.created_at, title: pr.title, url: pr.html_url }))

const generateHtml = json => 
engine
    .renderFile("email", json)


fetch('https://api.github.com/repos/guardian/dotcom-rendering/pulls?state=all')
  .then(res => res.json())
    .then(filterByDate)
    .then(getDescriptions)
    .then(json => ({ prs: json }))
    .then(json => { console.log(json); return json})
    .then(generateHtml)
    .then(html => fs.writeFile('email.html', html, e => console.log))
  .catch(e => console.log(e))