const handleSuccess = (res, isMessage, data) => {
  const customMessage = typeof isMessage === "string" ? isMessage : "Success"; 
  const responseData = typeof isMessage === "string" ? data : isMessage;
  return res.status(200).send({
    status: 200,
    message: customMessage,
    data: responseData,
  });
};

const handleBadRequest = (res, customMessage = "Something went wrong") => {
  return res.status(400).send({ status: 400, message: customMessage });
};

const handleNotFound = (res, customMessage = "Record not found") => {
  return res.status(404).send({ status: 404, message: customMessage });
};

const handleForbidden = (res, customMessage = "Already inserted") => {
  return res.status(403).send({ status: 403, message: customMessage });
};

const handleEmptyBody = (res, customMessage = "Empty body") => {
  return res.status(500).send({ status: 500, message: customMessage });
};
module.exports = {
  handleSuccess,
  handleForbidden,
  handleNotFound,
  handleBadRequest,
  handleEmptyBody
};
