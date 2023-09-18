//
//
// Created custom error
class CustomError extends Error {
  cunstructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default CustomError;
