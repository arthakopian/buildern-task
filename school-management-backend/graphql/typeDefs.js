exports.typeDefs = `
  type Teacher {
    id: Int!
    name: String!
  }

  type Pupil {
    id: Int!
    name: String!
    grade: String!
    subjectIds: [Int!]!
    subjects: [Subject!]!
  }

  type Subject {
    id: Int!
    name: String!
    teacherId: Int!
    teacher: Teacher!
  }

  type User {
    id: Int!
    username: String!
    role: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type TeacherList {
    teachers: [Teacher!]!
    totalCount: Int!
  }

  type Query {
    getTeachers(limit: Int, offset: Int, searchTerm: String): TeacherList!
    getSubjects: [Subject!]!
    getPupils: [Pupil!]!
    validateToken: AuthResponse!
  }

  type Deleted {
    success: Boolean!
  }

  type Mutation {
    createTeacher(name: String!): Teacher!
    editTeacher(name: String!, id: Int!): Teacher!
    deleteTeacher(id: Int): Deleted!
    createSubject(name: String!, teacherId: Int!): Subject!
    editSubject(name: String!, teacherId: Int!, id: Int!): Subject!
    deleteSubject(id: Int): Deleted!
    createPupil(name: String!,grade: String!,subjectIds: [Int!]!): Pupil!
    editPupil(name: String!,grade: String!,subjectIds: [Int!]!, id: Int!): Pupil!
    deletePupil(id: Int): Deleted!
    addPupil(name: String!, grade: String!): Pupil!
    login(username: String!, password: String!): AuthResponse!
  }
`;