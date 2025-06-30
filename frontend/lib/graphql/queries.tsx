import { gql } from "@apollo/client"

export const GET_AWARDS = gql`
  query GetAwards($filter: AwardFilter) {
    awards(filter: $filter) {
      id
      title
      code
      donor
      value
      deadline
      citizenship
      description
      eligibility
      application_method
      category
      is_active
      created_at
      updated_at
      created_by
    }
  }
`

export const GET_FEATURED_AWARDS = gql`
  query GetFeaturedAwards {
    featuredAwards {
      id
      title
      code
      donor
      value
      deadline
      citizenship
      description
      eligibility
      application_method
      category
      is_active
      created_at
      updated_at
      created_by
    }
  }
`

export const GET_AWARD = gql`
  query GetAward($id: ID!) {
    award(id: $id) {
      id
      title
      code
      donor
      value
      deadline
      citizenship
      description
      eligibility
      application_method
      category
      is_active
      created_at
      updated_at
      created_by
    }
  }
`

export const CREATE_AWARD = gql`
  mutation CreateAward($input: CreateAwardInput!) {
    createAward(input: $input) {
      id
      title
      code
      donor
      value
      deadline
      citizenship
      description
      eligibility
      application_method
      category
      is_active
      created_at
      updated_at
      created_by
    }
  }
`

export const UPDATE_AWARD = gql`
  mutation UpdateAward($id: ID!, $input: UpdateAwardInput!) {
    updateAward(id: $id, input: $input) {
      id
      title
      code
      donor
      value
      deadline
      citizenship
      description
      eligibility
      application_method
      category
      is_active
      created_at
      updated_at
      created_by
    }
  }
`

export const DELETE_AWARD = gql`
  mutation DeleteAward($id: ID!) {
    deleteAward(id: $id)
  }
`
