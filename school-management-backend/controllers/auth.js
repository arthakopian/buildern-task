const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const admin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'User already exists.' });
  }
};