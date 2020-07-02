/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRealtor = /* GraphQL */ `
  query GetRealtor($id: ID!) {
    getRealtor(id: $id) {
      id
      clientId
      street1
      street2
      city
      state
      zipcode
      neighborhood
      salesPrice
      dateListed
      bedrooms
      photos
      bathrooms
      garageSize
      squareFeet
      lotSize
      description
      createdAt
      updatedAt
    }
  }
`;
export const listRealtors = /* GraphQL */ `
  query ListRealtors(
    $filter: ModelRealtorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRealtors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        clientId
        street1
        street2
        city
        state
        zipcode
        neighborhood
        salesPrice
        dateListed
        bedrooms
        photos
        bathrooms
        garageSize
        squareFeet
        lotSize
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
