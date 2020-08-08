const express = require('express')
const auth = require('../middleware/auth')
const Post = require('../models/post')
const router = new express.Router()

// Create a post
router.post('/posts', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        creator: req.user._id
    })

    try {
        await post.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})


// Get all user's posts by id
router.get('/posts', async (req, res) => {
    try {
        console.log(req.user._id)
        const posts = await Post.find({ creator: req.user._id})
        res.send(posts)
    } catch (e) {
        res.status(500).send()
    }
})

// Add new comment to post
router.post('/posts/comment', auth, async (req, res) => {
    try {
        const newComment = { creator: req.user._id, text: req.body.text }
        const post = await Post.findById(req.body.post_id)
        await post.postComment(newComment)
        res.send(newComment)
    } catch (e) {
        res.status(400).send()
    }
})


// Fetch user's posts

// Delete post

// Update post (TODO likes?)

module.exports = router