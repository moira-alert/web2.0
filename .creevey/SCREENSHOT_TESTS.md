#Screenshot tests

##Local running steps
###Before run
1) Register on `https://www.browserstack.com/`.
2) Go to instruction page `https://www.browserstack.com/automate/node`, where you find user, key and other configs.
3) Download BrowserStackLocal.
4) Create file auth.config.json into `web2.0/.creevey` directory and with content:

```json
{
    "user": "<browserstack-user>",
    "key": "<browserstack-accesskey>"
}
```

<h3>Run</h3>
Run the following commands in parallel:
- `BrowserStackLocal --key <browserstack-accesskey>`
- yarn storybook
- yarn creevey:ui
And go to `http://localhost:3000`
