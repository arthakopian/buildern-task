const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const app = express();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GraphQL Schema and Resolvers
const typeDefs = /* GraphQL */ `
  type Teacher {
    id: Int!
    name: String!
    subjects: [Subject!]!
  }

  type Pupil {
    id: Int!
    name: String!
    grade: String!
    subjects: [Subject!]!
  }

  type Subject {
    id: Int!
    name: String!
    teacher: Teacher
  }

  type User {
    id: Int!
    username: String!
    role: String!
  }

  type Query {
    teachers: [Teacher!]!
    pupils: [Pupil!]!
    subjects: [Subject!]!
    me: User
  }

  type Mutation {
    addTeacher(name: String!): Teacher!
    addPupil(name: String!, grade: String!): Pupil!
    addSubject(name: String!, teacherId: Int): Subject!
    login(username: String!, password: String!): String!
  }
`;

const resolvers = {
  Query: {
    teachers: () => prisma.teacher.findMany(),
    pupils: () => prisma.pupil.findMany(),
    subjects: () => prisma.subject.findMany(),
    me: (parent, args, context) => {
      if (!context.user) throw new Error("Not authenticated");
      return prisma.user.findUnique({ where: { id: context.user.id } });
    },
  },
  Mutation: {
    addTeacher: (parent, { name }) => prisma.teacher.create({ data: { name } }),
    addPupil: (parent, { name, grade }) => prisma.pupil.create({ data: { name, grade } }),
    addSubject: (parent, { name, teacherId }) =>
      prisma.subject.create({ data: { name, teacherId } }),
    login: async (parent, { username, password }) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      return jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ user: req.user }) });

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
  });
});
