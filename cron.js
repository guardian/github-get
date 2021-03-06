#!/usr/bin/env node 
const run = require('./index');

const cron = require('node-cron');
const repoNames = ['dotcom-rendering', 'discussion-rendering', 'frontend', 'ab-testing', 'atoms-rendering', 'image-rendering', 'automat', 'liveblog-rendering', 'types'];
 
console.log('Scheduling');
run(7, repoNames);

cron.schedule('30 9-17/3 * * 1-5', () => { //“At minute 30 past every 3rd hour from 9 through 17 on every day-of-week from Monday through Friday.”
    console.log('Running')
    run(1, repoNames);
});

cron.schedule('0 10 * * *', () => { // Every Monday 10am
    console.log('Running')
    run(7, repoNames);
});
