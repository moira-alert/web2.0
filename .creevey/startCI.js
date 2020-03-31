const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const util = require("util");
const AWS = require("aws-sdk");

const exexAsync = util.promisify(exec);

const root = path.join(__dirname, "..");
let storybook;

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
runScreenshotTests()
    .then(async (code) => {
        storybook.kill();
        const reportName = `report-${new Date().toISOString().split(":").join("-")}.gz`;
        await exexAsync(`npx tar -czf ${reportName} report`, { cwd: __dirname });
        await s3Upload(reportName);
        process.exit(code);
    })
    .catch((e) => {
        console.error(e);
        if (storybook) {
            storybook.kill();
        }
        process.exit(1);
    });


function s3Upload(fileName) {
    const s3 = new AWS.S3({
        accessKeyId: process.env["S3_ACCESS_KEY_ID"],
        secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"],
    });

    const fileContent = fs.readFileSync(path.join(__dirname, fileName));
    const params = {
        Bucket: "travis-moira",
        Key: `tests/${fileName}`,
        Body: fileContent,
        ACL: "public-read",
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                console.log(`Screenshot tests artifact uploaded successfully. ${data.Location}`);
                resolve();
            }
        });
    });
}
