export abstract class BaseExecutor {
    abstract findApp(): Promise<string | undefined>;
    abstract createOsascript(app: string, script: string): string;
}
