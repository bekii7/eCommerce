export const errorHandler = (err, req, res, next) => {
  res
    .status(res.statusCode !== 200 ? res.statusCode : 400)
    .json({ message: err.message });
};
