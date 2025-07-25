const error_code = require("./error_code.json");

module.exports = {
  errorHandler: (err) => {
    let code = 1;
    if (err.code) {
      code = err.code;
    }
    return {
      error: error_code[code],
    };
  },
  responseHandler: () => {
    return {};
  },
};
