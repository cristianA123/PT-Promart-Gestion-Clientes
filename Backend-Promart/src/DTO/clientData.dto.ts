interface ClientDTO {
    name: string
    firstName: string
    lastName?: string
    email: string
    birthDay: Date | string
    state?: string
    stateUpdatedAt?: Date
    isDeleted?: boolean
    createdAt?: Date
    updatedAt?: Date
}
export default ClientDTO;
