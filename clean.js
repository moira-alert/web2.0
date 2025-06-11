const fs = require("fs");
const path = require("path");

const TARGET_DIR = path.resolve(__dirname, "src");

const IMPORTS_TO_REMOVE = [
    '@import "~styles/variables.less";',
    '@import "~styles/mixins.module.less";',
];

function cleanLessImports(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            cleanLessImports(fullPath);
        } else if (file.isFile() && fullPath.endsWith(".module.less")) {
            let content = fs.readFileSync(fullPath, "utf-8");

            const originalContent = content;

            IMPORTS_TO_REMOVE.forEach((importLine) => {
                const importRegex = new RegExp(
                    `^\\s*${importLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`,
                    "gm"
                );
                content = content.replace(importRegex, "");
            });

            if (content !== originalContent) {
                content = content.replace(/^\s*[\r\n]/gm, "");
                fs.writeFileSync(fullPath, content, "utf-8");
                console.log(`Обновлён: ${fullPath}`);
            }
        }
    }
}

cleanLessImports(TARGET_DIR);
