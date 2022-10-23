export const enum ErrorCode {
    JSX_PATH_NOT_EXISTS,
    APPLICATION_NOT_FOUND,
    EVAL_FAILED,
}

export class EvalJsxError extends Error {
    constructor(public message: string, public code: ErrorCode) {
        super();
    }
}
