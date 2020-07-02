/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRealtor = /* GraphQL */ `
  mutation CreateRealtor(
    $input: CreateRealtorInput!
    $condition: ModelRealtorConditionInput
  ) {
    createRealtor(input: $input, condition: $condition) {
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
export const updateRealtor = /* GraphQL */ `
  mutation UpdateRealtor(
    $input: UpdateRealtorInput!
    $condition: ModelRealtorConditionInput
  ) {
    updateRealtor(input: $input, condition: $condition) {
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
export const deleteRealtor = /* GraphQL */ `
  mutation DeleteRealtor(
    $input: DeleteRealtorInput!
    $condition: ModelRealtorConditionInput
  ) {
    deleteRealtor(input: $input, condition: $condition) {
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
