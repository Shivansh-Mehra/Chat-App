import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    message: {
        type: String,
    },
    image: {
        type: {
            url: String,
            filename: String
        }
    }
},{timestamps: true});

const messageModel = mongoose.model('Message',messageSchema);

export default messageModel;