const router = require('express').Router();
const { User, Post } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id'})
            return;
        }
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(400).json({ message: 'No user with that username found!'})
            return;
        }
        // will validate password at login 
        const validPassword = userData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!'});
            return;
        }
        res.json({ user: userData, message: 'Successfully logged in '});
    })
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id'})
            return;
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id'})
            return;
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;