import { exec, ExecException } from "child_process";

export function dropDataBase(): Promise<string> {
    return new Promise((resolve, reject) => {
        // NOTE: name "api_redis_1" depends on folder's name with docker-compose.yml
        exec(
            `docker exec -t api_redis_1 sh -c "redis-cli flushall"`,
            (error: ExecException | null, stdout: string, stderr: string) => {
                if (error || stderr) {
                    reject(error || stderr);
                } else {
                    resolve(stdout);
                }
            }
        );
    });
}

export const delay = (timeout: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, timeout));
