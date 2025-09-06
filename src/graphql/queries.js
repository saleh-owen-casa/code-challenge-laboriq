import { gql } from 'graphql-tag';

export const listContacts = gql`
  query ListContacts {
    listContacts {
      recordId
      firstName
      lastName
      emailAddress
    }
  }
`;

export const getContact = gql`
  query GetContact($recordId: ID!) {
    getContact(recordId: $recordId) {
      recordId
      firstName
      lastName
      dateOfBirth
      emailAddress
      phoneNumber
      homeAddress
      favoriteColor
      createdAt
    }
  }
`;

export const createContact = gql`
  mutation CreateContact(
    $firstName: String!
    $lastName: String!
    $dateOfBirth: String!
    $emailAddress: String!
    $phoneNumber: String
    $homeAddress: String
    $favoriteColor: String
  ) {
    createContact(
      firstName: $firstName
      lastName: $lastName
      dateOfBirth: $dateOfBirth
      emailAddress: $emailAddress
      phoneNumber: $phoneNumber
      homeAddress: $homeAddress
      favoriteColor: $favoriteColor
    ) {
      recordId
      firstName
      lastName
      dateOfBirth
      emailAddress
      phoneNumber
      homeAddress
      favoriteColor
      createdAt
    }
  }
`;
