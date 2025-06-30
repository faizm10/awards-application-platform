export const typeDefs = `
  type Award {
    id: ID!
    title: String!
    code: String!
    donor: String!
    value: String!
    deadline: String!
    citizenship: [String!]!
    description: String!
    eligibility: String!
    application_method: String!
    category: String!
    is_active: Boolean!
    created_at: String!
    updated_at: String!
    created_by: String
  }

  input AwardFilter {
    category: String
    search: String
    is_active: Boolean
  }

  type Query {
    awards(filter: AwardFilter): [Award!]!
    award(id: ID!): Award
    featuredAwards: [Award!]!
  }

  type Mutation {
    createAward(input: CreateAwardInput!): Award!
    updateAward(id: ID!, input: UpdateAwardInput!): Award!
    deleteAward(id: ID!): Boolean!
  }

  input CreateAwardInput {
    title: String!
    code: String!
    donor: String!
    value: String!
    deadline: String!
    citizenship: [String!]!
    description: String!
    eligibility: String!
    application_method: String!
    category: String!
  }

  input UpdateAwardInput {
    title: String
    code: String
    donor: String
    value: String
    deadline: String
    citizenship: [String!]
    description: String
    eligibility: String
    application_method: String
    category: String
    is_active: Boolean
  }
`
