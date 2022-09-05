# Moira Web 2.0

This repo is for Moira's Web UI built on React/TypeScript. If you're new here, please check out our main [README](https://github.com/moira-alert/moira/blob/master/README.md).

## Development

You need [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed. After cloning the repo, make sure you have all dependencies installed by running `yarn install`.

### Building

```bash
yarn build
```

All files will be prepared in the **dist** folder.

### Developing

```bash
yarn start
```

Starts a dev server on port 9000 and a fakeapi server (provides mock api data) on port 9002, in parallel.

```bash
yarn withBackend
```

Starts a dev server on port 9000 and a dockerized backend instance, in parallel.

```bash
yarn start-with-local-api
```

Starts a dev server as a proxy to your API service. Make sure you have a local Moira API service set up and add its URL to `webpack.dev.js` in `devServer.proxy` block.

```bash
yarn storybook
```

Starts [Storybook](https://storybook.js.org) on port 9001.

```bash
yarn lint
```

[ESLint](https://eslint.org) check. _Will run before every commit via [husky](https://typicode.github.io/husky/#/)_.

```bash
yarn tsc --noEmit
 ```

Runs the [TypeScript](https://www.typescriptlang.org) compiler for type-safety checking.  _Will run before every commit via [husky](https://typicode.github.io/husky/#/)_.

## Contributing

First of all, thank you for your help!

For contributors, we have two major rules:

- Please, create your issues [in the main repo](https://github.com/moira-alert/moira/issues). Even if you think that your issue concerns only the web interface, often it doesn't.
- If you want to send a PR, checkout a branch for you feature from `master` and name it like so `feature/%feautre_name%`. Also, when sending a PR choose `master` as the base branch.
