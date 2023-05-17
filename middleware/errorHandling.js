const handleStatusCodeError = (res, statusCode, customMessage, data) => {
  let message = "";
  switch (statusCode) {
    case 400:
      message = customMessage || "Default error message for 400 status code";
      break;
    case 401:
      // Handle Unauthorized error
      message = customMessage || "Default error message for 401 status code";
      break;
    case 404:
      // Handle Not Found error
      message = customMessage || "Default error message for 404 status code";
      break;
    // Add more cases as needed
    default:
      // Handle other status codes
      message = customMessage || "Default error message for other status codes";
  }

  res
    .status(statusCode)
    .json({ status: statusCode, message: message, data: data });
};

module.exports = handleStatusCodeError;
