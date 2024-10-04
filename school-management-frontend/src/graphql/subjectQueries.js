import { gql } from '@apollo/client';

export const GET_SUBJECTS = gql`
  query GetSubjects {
    getSubjects {
      id
      name
      teacher{
        id
        name
      }
    }
  }
`;

export const CREATE_SUBJECT = gql`
  mutation CreatSubject($name: String!, $teacherId: Int!) {
    createSubject(name: $name, teacherId: $teacherId) {
      id
      name
      teacherId
    }
  }
`;

export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: Int!) {
    deleteSubject(id: $id){
      success
    }
  }
`;

export const EDIT_SUBJECT = gql`
  mutation EditSubject($name: String!, $teacherId: Int!, $id: Int!) {
    editSubject(name: $name, teacherId: $teacherId, id: $id) {
      name
      teacherId
    }
  }
`;

