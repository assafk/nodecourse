class ValidationError extends Error {
  constructor(field, value, allowed) {

    super();
    this.field = field;
    this.value = value;
    this.allowed = allowed;
  }
}
module.exports = ValidationError;