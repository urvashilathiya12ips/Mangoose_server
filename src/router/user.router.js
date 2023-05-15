const express = require('express')
const router = new express.Router()
const {
    signup,
    signin,
    profile   
} = require('../controller/user.controller')

const verifytoken = require('../../middleware/verifytoken')


////////////User related routes/////////////
router.post('/signup', signup)
router.post('/signin', signin)
router.get('/profile',verifytoken, profile)

module.exports = router