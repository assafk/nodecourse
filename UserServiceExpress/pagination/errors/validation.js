class ValidationError extends Error {
  constructor(field, value) {
    super();
    this.field = field;
    this.value = value;
  }
}

module.exports = ValidationError;