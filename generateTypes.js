import "dotenv/config";

const OUTPUT_DIR = "src/Domain/__generated__";
const SWAGGER_URL = process.env.SWAGGER_URL;

const generate = async () => {
    const { resolve } = await import("path");
    const { generateApi } = await import("swagger-typescript-api");

    const output = resolve(process.cwd(), OUTPUT_DIR);

    const { files } = await generateApi({
        url: SWAGGER_URL,
        output,
        modular: true,
        moduleNameIndex: 1,
        cleanOutput: true,
        generateClient: false,
        moduleNameFirstTag: true,
    });
};

try {
    generate();
} catch (error) {
    console.error(error);
}
