import mongoose, { Schema, Document } from 'mongoose';
import { lowercase } from 'zod';

// Interface que estende Document do Mongoose para tipagem forte
export interface IUser extends Document {
    email: string;
    passwordHash: string; // Armazenamos o haxh da senha, não a senha pura
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true 
    },
    passwordHash: {
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model<IUser>('User', UserSchema);