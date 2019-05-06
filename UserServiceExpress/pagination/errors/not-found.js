class NotFoundError extends Error {
  constructor(field) {
    super();
    this.field = field;
  }
}

module.exports = NotFoundError;