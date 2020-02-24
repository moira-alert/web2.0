# Moira Web 2.0 [![Build Status](https://travis-ci.org/moira-alert/web2.0.svg?branch=master)](https://travis-ci.org/moira-alert/web2.0) [![Dependency Status](https://david-dm.org/moira-alert/web2.0.svg)](https://david-dm.org/moira-alert/web2.0) [![devDependencies Status](https://david-dm.org/moira-alert/web2.0/dev-status.svg)](https://david-dm.org/moira-alert/web2.0?type=dev)

It's repo for Moira Web UI. If you're new here, better check out our main [README](https://github.com/moira-alert/moira/blob/master/README.md).

## Development

You need [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed. After cloning repo make sure you have installed all dependencies by running `yarn install`.

### Building

```bash
yarn build
```

All files will be prepared in **dist** folder.

### Developing

```bash
yarn start
```

Starts dev server on port 9000 and fakeapi server (provides mock api data) on port 9002, in parallel.

```bash
yarn start-with-local-api
```

Starts dev server with proxy to your API service. Make sure you setup local Moira API service and add it URL to `webpack.config.js` in `devServer.proxy` block.

```bash
yarn storybook
```

Starts [Storybook](https://storybook.js.org) on port 9001.

```bash
yarn lint
```

[ESLint](https://eslint.org) check. _Recommended to run before commit_.

```bash
yarn flow
```

Starts [Flow](https://flow.org) server for checking types. You can also run `yarn flow.status` for status, `yarn flow.check` for errors report, `yarn flow.coverage.html` to export html report with cute UI.

## Contributing

First of all thank you for your help!

For contributors we have two major rules:

- Put issues [in main repo](https://github.com/moira-alert/moira/issues), please. Even if you think, that your issue only about web interface. In many cases that's no so.
- If you want to send PR, checkout you feature branch from `master` and name it by template `feature/%feautre_name%`. When you send PR alson choice `master` as base.
