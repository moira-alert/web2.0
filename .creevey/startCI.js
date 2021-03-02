// Start tests on travis CI
const { exec, spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
let storybook;

runScreenshotTests()
    .then(async (code) => {
        storybook.kill();
        process.exit(code);
    })
    .catch((e) => {
        console.error(e);
        if (storybook) {
            storybook.kill();
        }
        process.exit(1);
    });

function runScreenshotTests() {
    // spawn need for kill storybook process
    storybook = spawn("node", ["node_modules/@storybook/react/bin/index.js", "-p 9001", "--ci"], {
        env: {
            ...process.env,
            NODE_ENV: "development",
        },
        cwd: root,
    });

    const creevey = exec("yarn creevey", { cwd: root });

    creevey.stdout.on("data", data => console.log(data.toString()));
    creevey.stderr.on("data", data => console.error(data.toString()));

    return new Promise(resolve => creevey.on("exit", resolve));
}
