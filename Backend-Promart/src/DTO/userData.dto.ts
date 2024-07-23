interface UserDataDTO {
    email: string;
    uuid: string;
    password?: string;
    userName: string;
    lastLogin?: Date;
}
export default UserDataDTO;