import { gql } from 'apollo-angular';

export const STAKEHOLDER_COUNT_BY_TYPE = gql`
  query StakeholdersWithSharedTaxIdentifier {
  stakeholderCountByType {
    list {
      type
      count
    }
    chart {
      labels
      series {
        name
        data
      }
    }
    total
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

export const GET_STAKEHOLDER_BY_ID = gql`
 query StakeholdersWithSharedTaxIdentifier($stakeholderId: ID!) {
  stakeholder(id: $stakeholderId) {
    id
    stakeholderType
    type
    userDetails {
      ... on ClientDetails {
        iban
        clientCode
        origin
        businessSector
        clientType
        agreement
        associatedConsultant
        sdiCode
        from
      }
      ... on SupplierDetails {
        paymentMethod
      }
      ... on EmployeeDetails {
        role
        reference
      }
      ... on UtilizerDetails {
        reference
      }
    }
    companyName
    taxIdentifier
    personalData {
      id
      name
      surname
      fiscalCode
      email
      phone
      gender
      birthday
      birthPlace
      birthCounty
      title
      address
      cap
      province
      common
      region
      houseNumber
      latitude
      longitude
    }
    companyData {
      id
      companyName
      vatNumber
      phone
      email
      region
      province
      common
      cap
      houseNumber
      address
      latitude
      longitude
      pec
      sdiCode
    }
  }
}
`;

export const GET_STAKEHOLDERS_MATCHES = gql`
query StakeholdersByCompanyAndPersonal($companyData: ID!, $personalData: ID!) {
  stakeholdersByCompanyAndPersonal(companyData: $companyData, personalData: $personalData) {
    stakeholderType
    userDetails {
      ... on ClientDetails {
        iban
        clientCode
        origin
        businessSector
        clientType
        agreement
        associatedConsultant
        sdiCode
        from
      }
      ... on SupplierDetails {
        paymentMethod
      }
      ... on EmployeeDetails {
        role
        reference
      }
      ... on UtilizerDetails {
        role
        reference
      }
    }
  }
}
`

