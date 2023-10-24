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

Starts a dev server on port 9000 and a fakeapi server (provides mock api data) on port 9002, in parallel. **This is not recommended** because the fakeapi server may not be 100% consistent with the actual backend.

```bash
yarn start:dev-proxy
```

Starts a dev server on port 9000 and proxies all API requests to a separately deployed backend. The URL for API requests can be set with the `MOIRA_API_URL` env variable. Supports basic auth which can be configured using `MOIRA_API_LOGIN` and `MOIRA_API_PASSWORD` env variables.

```bash
yarn start:port-forward
```

For SKB Kontur developers only. Starts a dev server on port 9000 and proxies all API requests to port 9002, which is forwarded to API Kubernetes pod. For the easiest way to use Lens, see: https://k8slens.dev/. The staging cluster config is [here](https://k8s.testkontur.ru/).

```bash
yarn start:docker
```

Starts a dev server on port 9000 and a dockerized backend instance, in parallel. API requests are proxied to Docker.

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
