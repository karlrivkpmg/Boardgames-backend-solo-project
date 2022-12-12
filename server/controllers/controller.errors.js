exports.handle404s = (req, res) => {
    res.status(404).send({ msg: 'Route not found'});
  };