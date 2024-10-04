import { gql } from '@apollo/client';

export const GET_PUPILS = gql`
  query GetPupils {
    getPupils {
      id
      name
      grade
      subjects {
        id
        name
      }
    }
  }
`;

export const CREATE_PUPIL = gql`
  mutation CreatePupil($name: String!, $grade: String!, $subjectIds: [Int!]!) {
  createPupil(name: $name, grade: $grade, subjectIds: $subjectIds) {
    id
    name
    grade
    subjects {
      id
      name
    }
  }
}
`;

export const DELETE_PUPIL = gql`
  mutation DeletePupil($id: Int!) {
    deletePupil(id: $id){
      success
    }
  }
`;

export const EDIT_PUPIL = gql`
  mutation EditPupil($name: String!, $grade: String!, $id: Int!, $subjectIds: [Int!]!) {
  editPupil(name: $name, grade: $grade, id: $id, subjectIds: $subjectIds) {
    id
    name
    grade
    subjects {
      id
      name
    }
  }
}
`;


