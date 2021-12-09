const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/comments
router.get('/', (req, res) => {
    Comment.findAll()
        .then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});


// POST /api/comments
router.post('/', withAuth, (req, res) => {
    // check the session
    console.log(req.body)
    if (req.session) {
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        // use id from the session
        user_id: req.session.user_id,
    })
    .then(commentData => res.json(commentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
        })
    }
});


// DELETE /api/comments/1
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(commentData => {
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id '})
            return;
        }
        res.json(commentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;