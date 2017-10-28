# api
Stupid simple API for random things we'd like to expose on the website or through slack.

Assuming nginx is sitting in front of it, use pm2 to get it going.

```
NODE_ENV=production pm2 start start.js --name "odw2017"
```
