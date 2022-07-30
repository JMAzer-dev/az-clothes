const getError = (err) =>
  err.responde.data && err.response.data.message
    ? err.message.data.message
    : err.message;

export { getError };
