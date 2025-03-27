import { gql } from 'apollo-angular';

export const STAKEHOLDER_COUNT_BY_TYPE = gql`
  query StakeholderCountByType {
    stakeholderCountByType {
      type
      count
    }
  }
`;

export const GET_STAKEHOLDERS_BY_TYPE = gql`
  query GetStakeholdersByType($stakeholderType: String!, $limit: Int, $skip: Int) {
    stakeholdersByType(stakeholderType: $stakeholderType, limit: $limit, skip: $skip) {
      id
      type
      companyName
      stakeholderType
      taxIdentifier
      personalData {
        name
        surname
        email
      }
    }
  }
`;



export const GET_STAKEHOLDERS_WHITH_SHARED_TAXIDENTIFIER = gql`
  query StakeholdersWithSharedTaxIdentifier($filter: StakeholderFilterInput, $limit: Int, $skip: Int) {
  stakeholdersWithSharedTaxIdentifier(filter: $filter, limit: $limit, skip: $skip) {
    stakeholder {
      id
      stakeholderType
      type
      companyName
      taxIdentifier
    }
    matches {
      id
      stakeholderType
    }
  }
}
`;

export const SEARCH_STAKEHOLDERS = gql`
  query Query($limit: Int, $skip: Int) {
    stakeholders(limit: $limit, skip: $skip) {
      id
      stakeholderType
      type
      companyName
      taxIdentifier
    }
  }
`
