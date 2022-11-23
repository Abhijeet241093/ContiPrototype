import BaseModelEntity from "./baseModel.entity.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../../config.js";
import { v4 } from 'uuid'
class UserEntity extends BaseModelEntity {


    static get tableName() {
        return "User";
    }

    // static get jsonSchema() {
    //     return {
    //         type: 'object',
    //         required: ['id'],
    //         properties: {
    //             id: { type: 'text' },
    //             email: { type: 'text' },
    //             name: { type: 'text' },
    //             passwordHash: { type: 'text', default: null },
    //             type: { type: 'text' },
    //             // avatars: { type: 'jsonb' },
    //             isConfirm: { type: 'boolean', default: false }
    //         }
    //     };
    // }
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
                isConfirm: user.isConfirm
            },
            config.jwtKey
        );
    }
    static async addUser(obj) {
        let passwordHash = await this.setPassword(obj.password)
        let clone ={...obj}
        delete clone.password
        delete clone.confirm
        clone.passwordHash =passwordHash
        clone.id = v4()
        return await this.query().insert(clone);
    }
    static async updateUser(email, data) {
        await await this.query().findOne({ email }).update(data)
    }
}

export default UserEntity;
