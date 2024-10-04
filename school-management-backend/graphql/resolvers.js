const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.resolvers = {
  Query: {
    getTeachers: async (parent, { limit = 10, offset = 0, searchTerm = '' }) => {
      const teachers = await prisma.teacher.findMany({
        where: {
          ...(searchTerm ? {
            name: {
              contains: searchTerm.toLocaleLowerCase(),
            }
          } : {}),
        },
        skip: offset,
        take: limit,
      });
      console.log('Teachers:', teachers);
      const totalTeachers = await prisma.teacher.count();

      return {
        teachers,
        totalCount: totalTeachers,
      };
    },
    getSubjects: () => prisma.subject.findMany({
      include: { teacher: true },
    }),
    getPupils: () => prisma.pupil.findMany({
      include: { subjects: true }
    }),
    validateToken: (parent, args, context) => {
      if (!context.user) throw new Error("Not authenticated");
      return { token: context.token }
    },
  },
  Mutation: {
    createTeacher: (parent, { name }) => prisma.teacher.create({ data: { name } }),
    editTeacher: (parent, { name, id }) => prisma.teacher.update({ where: { id }, data: { name } }),
    deleteTeacher: async (parent, { id }) => {
      try {
        await prisma.teacher.delete({ where: { id } })
        return { success: true }
      } catch (error) { return { success: false } }
    },
    createSubject: (parent, { name, teacherId }) =>
      prisma.subject.create({
        data: {
          name,
          teacherId
        },
        include: {
          teacher: true,
        },
      }),
    editSubject: (parent, { name, teacherId, id }) =>
      prisma.subject.update({
        where: { id }, data: { name, teacherId }
      }),
    deleteSubject: async (parent, { id }) => {
      try {
        await prisma.subject.delete({ where: { id } })
        return { success: true }
      } catch (error) { return { success: false } }
    },
    createPupil: (parent, { name, grade, subjectIds }) =>
      prisma.pupil.create({
        data: {
          name,
          grade,
          subjects: {
            connect: subjectIds.map(id => ({ id }))
          }
        },
        include: {
          subjects: true,
        },
      }),
    editPupil: (parent, { name, grade, subjectIds, id }) =>
      prisma.pupil.update({
        where: { id }, data: {
          name, grade, subjects: {
            connect: subjectIds.map(id => ({ id }))
          }
        },
        include: {
          subjects: true,
        },
      }),
    deletePupil: async (parent, { id }) => {
      try {
        await prisma.pupil.delete({ where: { id } })
        return { success: true }
      } catch (error) { return { success: false } }
    },
    addPupil: (parent, { name, grade }) => prisma.pupil.create({ data: { name, grade } }),
    login: async (parent, { username, password }, context) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1d',
      });

      // Return an object matching the AuthPayload type
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      };
    },
  },
};