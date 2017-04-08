const ROOT_DIR = './';

exports.index = (req, res) => {
  res.sendFile('dist/index.html', {root: ROOT_DIR});
};
