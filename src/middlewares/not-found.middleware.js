export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      path: req.originalUrl,
      method: req.method,
    },
  });
};
