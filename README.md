# Moira Web 2.0 [![Build Status](https://travis-ci.org/moira-alert/web2.0.svg?branch=master)](https://travis-ci.org/moira-alert/web2.0) [![Dependency Status](https://david-dm.org/moira-alert/web2.0.svg)](https://david-dm.org/moira-alert/web2.0)

After clone repo make sure you installed all dependencies by run `yarn install`.

## Build

`yarn build`

All files will prepared in **dist** folder.

## Developing

`yarn start`

Start dev server on port 9000. Need to run `yarn fakeapi` in parallel for data. Fake API server starts on port 9002.

`yarn start --env.API=local`

Start dev server with proxy to your API service. Make sure you setup local Moira API service and add it URL to `webpack.config.js` in `devServer.proxy` block.

`yarn storybook`

Start [Storybook](https://storybook.js.org) on port 9001.

`yarn lint`

[ESLint](https://eslint.org) check. _Recommend run before commit_.

`yarn flow`

Start [Flow](https://flow.org) server for checking types. You can also run `yarn flow.status` for status, `yarn flow.check` for errors report, `yarn flow.coverage.html` for export report to html with cute UI.

---

[More about Moira](https://github.com/moira-alert/moira/blob/master/README.md)
