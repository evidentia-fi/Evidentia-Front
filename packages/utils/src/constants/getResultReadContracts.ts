type SuccessResult<T> = { status: 'success'; result: T };
type FailureResult = { status: 'failure'; error: Error };
type Result<T> = SuccessResult<T> | FailureResult;

export const getResultReadContracts = <T>(entry: Result<T> | undefined): T | undefined =>
  entry?.status === 'success' ? entry.result : undefined;
