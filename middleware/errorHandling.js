const handleSuccessMsg = (res, customMessage = "Successfull", data) => {
  return res.status(200).send({
    status: 200,
    message: customMessage,
    data: data,
  });
};

const handlebadrequest = (res, customMessage = "Something went wrong") => {
  return res.status(400).send({ status: 400, message: customMessage });
};

const handlenotfound = (res, customMessage = "Record not Found") => {
  return res.status(404).send({ status: 404, message: customMessage });
};

const handleforbidden = (res, customMessage = "resource is forbidden") => {
  return res.status(403).send({ status: 403, message: customMessage });
};

const handleemptybody = (res, customMessage = "Empty Body") => {
  return res.status(500).send({ status: 500, message: customMessage });
};
module.exports = {
  handleSuccessMsg,
  handleforbidden,
  handlenotfound,
  handlebadrequest,
  handleemptybody,
};
