const handleSuccessMsg = (res, customMessage, data) => {
  res.status(200).send({
    status: 200,
    message: customMessage || "successful",
    data: data,
  });
};

const handlebadrequest = (res, customMessage) => {
  res
    .status(400)
    .send({ status: 400, message: customMessage || "Bad Request Error" });
};

const handlenotfound = (res, customMessage) => {
  res.status(404).send({ status: 404, message: customMessage || "Not Found" });
};

module.exports = { handleSuccessMsg, handlenotfound, handlebadrequest };
