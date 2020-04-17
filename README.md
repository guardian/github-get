# Github Get

## Run

```
node cron.js
```

Will run immediately, generating `email.html` and then, if running, will regenerate periodically (look in cron.js).

## Different Repos

Edit the repos array in cron.js

## Contribute

- cron.js - Entry point and cron jobs
- index.js - main file making request, building json and calling out to liquid using email.liquid
- email.liquid - The markup for the html page, takes the generated json uses liquid templating language to build the page

## Screenshot

![Email html screenshot](screenshot.png)