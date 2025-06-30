import { gql } from "graphql-tag"

export const typeDefs = gql`
  type Profile {
    id: ID!
    email: String!
    full_name: String
    user_type: UserType!
    created_at: String!
    updated_at: String!
  }

  enum UserType {
    STUDENT
    REVIEWER
    ADMIN
  }

  input CreateProfileInput {
    email: String!
    full_name: String!
    user_type: UserType!
    password: String!
  }

  input UpdateProfileInput {
    id: ID!
    email: String
    full_name: String
    user_type: UserType
  }

  type Query {
    profiles(user_type: UserType): [Profile!]!
    profile(id: ID!): Profile
    reviewers: [Profile!]!
    admins: [Profile!]!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
    updateProfile(input: UpdateProfileInput!): Profile!
    deleteProfile(id: ID!): Boolean!
  }
`
