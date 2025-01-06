import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: ""
    }
}, {timestamps: true})

userSchema.plugin(passportLocalMongoose,{usernameField: 'email'});
const User = mongoose.model('User',userSchema);

export default User;