export const createResponse = (res, statusCode, data) => {
  res.status(statusCode).json({ data });
};
