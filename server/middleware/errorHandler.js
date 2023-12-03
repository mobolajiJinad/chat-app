const errorHandler = (err, req, res, next) => {
  let message = "Something went wrong";
  let status = 500;

  if (err.name === "ValidationError") {
    status = 422; // Unprocessable Entity
    message = err.message;
  } else if (err.name === "MongoError" && err.code === 11000) {
    status = 409; // Conflict
    message = "Duplicate key violation";
  } else if (err.name === "UnauthorizedError") {
    status = 401;
    message = "Unauthorized";
  } else if (err.status === 404) {
    status = 404;
    message = "The requested URL does not exist";
  }

  // Log the error for debugging purposes
  console.error(err);

  res.status(status).json({ error: { message } });
};

module.exports = errorHandler;
