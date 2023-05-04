const errorHandler = (err, req, res, next) => {
  let message = "Something went wrong.";
  let status = 500;

  if (err.status === 404) {
    message = "The requested page could not be found.";
    status = 404;
  }

  res.status(status).render("error", {
    title: "Error",
    message,
    error: err,
  });
};

module.exports = errorHandler;
