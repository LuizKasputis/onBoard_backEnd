import { User } from '../entity/User';

export class UserType{

    user: User;
    token: string;

    constructor(user : User, token : string){
        this.user= user;
        this.token = token;
    }

}