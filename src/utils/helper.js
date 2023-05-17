const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { Types } = require('mongoose');

const secret_key = '*@#$%^&*()-_=+'

const hashPassword = async (value) => {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(value, saltRounds, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        })
    })
    return hashedPassword
}

const comparePassword = async (password, hashPassword) => {
    const compared = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, (err, response) => {
            if (err) reject(err)
            resolve(response)
        })
    })
    return compared
}

const generateNewToken = async (payload, schedule = 60) => {
    const token = await new Promise((resolve, reject) => {
        jwt.sign({...payload, exp: Math.floor(Date.now() / 1000) + (schedule * 60)}, secret_key, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
    return token
}

const verifyUserToken = async (token) => {
    const isVerified = jwt.verify(token, secret_key)
    return isVerified
}

const handleAdminAccess = async(token) => {
    const isAdminAuthorized = await verifyUserToken(token)
    return isAdminAuthorized?.role === "admin"
}

const isValidObjectId = id => Types.ObjectId.isValid(id)

const isTokenExpired = async(res, token) => {
    try {
        const isExpired = jwt.verify(token, secret_key)
        if(!isExpired) return true
        return isExpired?.exp <= Math.floor(Date.now() / 1000)
    } catch (error) {return true}
}

module.exports = {
    isTokenExpired,
    isValidObjectId,
    handleAdminAccess,
    generateNewToken,
    comparePassword,
    hashPassword,
    verifyUserToken
}