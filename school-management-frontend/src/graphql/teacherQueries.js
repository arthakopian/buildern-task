import { gql } from '@apollo/client';

export const GET_TEACHERS = gql`
  query GetTeachers($limit: Int!, $offset: Int!, $searchTerm: String) {
    getTeachers(limit: $limit, offset: $offset, searchTerm: $searchTerm) {
      teachers {
        id
        name
      }
      totalCount
    }
}
`;

export const CREATE_TEACHER = gql`
  mutation CreatTeacher($name: String!) {
    createTeacher(name: $name) {
      id
      name
    }
  }
`;

export const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: Int!) {
    deleteTeacher(id: $id) {
      success
    }
  }
`;

export const EDIT_TEACHER = gql`
  mutation EditTeacher($name: String!, $id: Int!) {
    editTeacher(name: $name, id: $id) {
      name
    }
  }
`;

