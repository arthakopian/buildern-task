const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.processApolloContext = ({ req }) => {

  const token = req.headers.authorization || '';

  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
      return { user, token };
    } catch (err) {
      console.error('Invalid token');
    }
  }
}