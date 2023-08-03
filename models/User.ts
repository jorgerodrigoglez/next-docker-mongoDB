
import mongoose, { Schema, Model, model } from "mongoose";
import { IUser } from "@/interfacesjrg";


const userSchema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin','client','super-user','SEO'],
            message: '{VALUE} no es un role vállido',
            default: 'client',
            required: true
        }
     }
},{
     timestamps:true
})

const User: Model<IUser> = mongoose.models.User || model('User', userSchema );

export default User;