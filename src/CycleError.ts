export class CycleError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CycleError.prototype);
  }
}
