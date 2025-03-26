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
  query Query($stakeholderType: String!, $limit: Int, $skip: Int) {
  stakeholdersWithSharedTaxIdentifier(type: $stakeholderType, limit: $limit, skip: $skip) {
    matches {
      id
      stakeholderType
    }
    stakeholder {
      id
      stakeholderType
      type
      companyName
      taxIdentifier
    }
  }
}
`;
