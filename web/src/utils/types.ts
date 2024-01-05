interface MatchRequest {
    id: String
    requesterId: String
    receiverId: String
    createdAt: String
    propertyId: String
    matchStatus: String
}

interface Property {
    id: string
    name: string
    zipcode: string
    state: string
    city: string
    address: string
    price: number
    propertyType: string
    propertyNumber: number
    numBedroom: number
    numBathroom: number
    description: string
    createdAt: string
    userId: string
    onSale: Boolean
}

interface Image {
    imageUrl: string
    imageId: string
}

interface PropertyData {
    propertyData: Property
    imageData: Image[]
}

interface User {
    id: string
    name: string
    email: string
}

interface MatchData {
    userData: User
    propertyData: Property
    imageData: Image[]
    matchData: MatchRequest
}

const MatchStatus = {
    pending: 'Pending',
    accept: 'Accept',
    reject: 'Reject',
    complete: 'Complete',
}
