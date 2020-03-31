#Screenshot tests

##Local running steps
###Before run
1) Register on `https://www.browserstack.com/`.
2) Go to instruction page `https://www.browserstack.com/automate/node`.
3) Download BrowserStackLocal.
4) Create file authConfig.json into `web2.0/.creevey` directory and with content:

```json
{
    "user": "<browserstack-user>",
    "key": "<browserstack-accesskey>"
}
```

<h3>Run</h3>
From command line execute:
1) `BrowserStackLocal --key <you key>`
2) yarn storybook
3) yarn creevey:ui
4) Go to `http://localhost:3000`
