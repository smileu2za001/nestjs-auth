import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    private async hashPassword(PASSWORD: string, SALT: string): Promise<string> {
        return bcrypt.hash(PASSWORD, SALT);
    }

    async singUp(authCredentialsdto: AuthCredentialsDto): Promise<void> {
        const USERNAME = authCredentialsdto.username;
        const PASSWORD = authCredentialsdto.password;

        /* ERROR CORRECTING DUPPLICATE USERNAME
            const exists = this.findOne(USERNAME);

            if(exists){
                console.log("Username : "+ USERNAME + " is already signed up");
            }
        */

        const user = new User();
        user.username = USERNAME;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(PASSWORD, user.salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') { // dupplicate username
                console.log("Username : " + USERNAME + " is already signed up");
                throw new ConflictException('Username "' + USERNAME + '" is already signed up')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const USERNAME = authCredentialsDto.username;
        const PASSWORD = authCredentialsDto.password;

        const username = USERNAME;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(PASSWORD)) {
            return user.username;
        }
        else {
            return null;
        }
    }
}