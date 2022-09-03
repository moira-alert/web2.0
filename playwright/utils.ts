import { exec } from "child_process";
import { promisify } from "util";

const asyncExec = promisify(exec);

export async function clearDatabase(): Promise<void> {
    const redisService = await getRedisService();
    await asyncExec(`docker exec -t ${redisService} sh -c "redis-cli flushall"`);
}

export async function getRedisService(): Promise<string> {
    const execOut = await asyncExec(
        `docker ps --format "{{.Names}}" --filter status=running --filter ancestor=redis:alpine`
    );

    if (execOut.stderr) {
        throw new Error(execOut.stderr);
    }

    const redisServices = (await execOut.stdout).split("\n").filter(Boolean);

    if (redisServices.length > 1) {
        throw new Error(`The are several running redis instances: ${redisServices.join(" ")}`);
    }

    if (redisServices.length === 0) {
        throw new Error(`No running redis instances`);
    }

    return redisServices[0];
}
