exports.notFound = (req, res, next) => {
  const error = new Error(
    `Connot find route for ${req.originalUrl} at the server`
  );
  next(error);
};

exports.globalErrorHandler = (error, req, res, next) => {
  const status = error?.status ? error.status : "Failed";
  const stack = error?.stack;
  const message = error?.message;
  res.status(500).json({ status, message, stack });
};
