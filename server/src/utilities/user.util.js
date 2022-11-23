import {v4} from "uuid"
import bcrypt  from "bcryptjs"
import jwt from "jsonwebtoken"
export class UserModel {
    constructor( email, name, type,passwordHash) {
        this.id = v4();
        this.email =email ;
        this.name=name;
        this.type= type;
        this.passwordHash = passwordHash
    }
    
    static async isValidPassword(password, passwordHash) {
        return await bcrypt.compareSync(password, passwordHash);
    };

    static async setPassword(password) {
        return await bcrypt.hashSync(password, 10);
    };
    static generateJWT(user) {
        return jwt.sign(
            {
                email: user.email,
                name: user.name,
                isConfirm:user.isConfirm
            },
            process.env.JWT_SECRET
        );
    }
}