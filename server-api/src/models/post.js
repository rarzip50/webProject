const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    public: {
        type: Boolean,
        default: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        comment: {
            creator: {
                type: mongoose.Schema.Types.ObjectId,
            },
            text: {
                type: String,
                required: true,
                trim: true
            },
            date: {
                type: Date,
                required: true,
                default: Date.now
            }
        }
    }]
})

postSchema.methods.postComment = async function (comment) {
    const post = this

    post.comments = [...post.comments, { comment }]
    await post.save()
    
    return post
}

const Post = mongoose.model('Post', postSchema)

module.exports = Post
