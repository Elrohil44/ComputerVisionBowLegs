const asyncWrapper = (func) => (req, res, next) => Promise.resolve()
  .then(() => func(req, res, next))
  .catch(next);

const authorize = (token) => (req, res, next) => {
  if (req.headers && req.headers['api-auth'] === token) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

module.exports = {
  asyncWrapper,
  authorize,
};
