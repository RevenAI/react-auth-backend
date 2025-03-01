import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A post must have a title"],
        trim: true,
        maxlength: [200, "Title must be less than 200 characters"]
    },
    content: {
        type: String,
        required: [true, "A post must have content"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", // This for now assumes only admins create posts
        required: [true, "A post must have an author"]
    },
    category: {
        type: String,
        enum: ["Tech", "Health", "Business", "Education", "Lifestyle", "Other"],
        default: "Other"
    },
    tags: {
        type: [String], // Array of tags
        default: []
    },
    imageUrl: {
        type: String,
        default: ""
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Users who liked the post
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Middleware: Set `publishedAt` when post is published
postSchema.pre("save", function (next) {
    if (this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;