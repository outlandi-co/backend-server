const getData = (req, res) => {
  res.json({ message: 'Data retrieved successfully' });
};

const createData = (req, res) => {
  res.json({ message: 'Data created successfully' });
};

module.exports = { getData, createData };
