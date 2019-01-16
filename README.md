# Moira Web 2.0 [![Build Status](https://travis-ci.org/moira-alert/web2.0.svg?branch=master)](https://travis-ci.org/moira-alert/web2.0) [![Dependency Status](https://david-dm.org/moira-alert/web2.0.svg)](https://david-dm.org/moira-alert/web2.0) [![devDependencies Status](https://david-dm.org/moira-alert/web2.0/dev-status.svg)](https://david-dm.org/moira-alert/web2.0?type=dev)

If you're new here, better check out our main [README](https://github.com/moira-alert/moira/blob/master/README.md).

## Development

After cloning repo make sure you have installed all dependencies by running `yarn install`.

### Building

`yarn build`

All files will be prepared in **dist** folder.

## Developing

`yarn start`

Starts dev server on port 9000. You'll have to run `yarn fakeapi` in separate terminal to provide mock API data. Mock API server starts on port 9002.

`yarn start-local-api`

Starts dev server with proxy to your API service. Make sure you setup local Moira API service and add it URL to `webpack.config.js` in `devServer.proxy` block.

`yarn storybook`

Starts [Storybook](https://storybook.js.org) on port 9001.

`yarn lint`

[ESLint](https://eslint.org) check. _Recommended to run before commit_.

`yarn flow`

Starts [Flow](https://flow.org) server for checking types. You can also run `yarn flow.status` for status, `yarn flow.check` for errors report, `yarn flow.coverage.html` to export html report with cute UI.

## Contributing

Put issues [in main repo](https://github.com/moira-alert/moira/issues), please. Even if you think, that your issue only about web interface. In many cases that's no so. Thank you!

---

[More about Moira](https://github.com/moira-alert/moira/blob/master/README.md)
