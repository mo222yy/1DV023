'use strict'

const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const bcrypt = require('bcrypt')

const PASSWORD_MINIMUM_LENGTH = 8
const USERNAME_MINIMUM_LENGTH = 2
const USERNAME_MAXIMUM_LENGTH = 25

const nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [USERNAME_MINIMUM_LENGTH, USERNAME_MAXIMUM_LENGTH],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

const userSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    require: true,
    default: Date.now
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    validate: nameValidator
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: PASSWORD_MINIMUM_LENGTH
  }
})

// Control password length
userSchema.path('password').validate((password) => { return password.length >= PASSWORD_MINIMUM_LENGTH })

// Hash password
userSchema.pre('save', async function (next) {
  let user = this

  if (user.isModified('password') || user.isNew) {
    let hashPwd = await bcrypt.hash(user.password, 12)
    user.password = hashPwd
  }
  next()
})

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('user', userSchema)

module.exports = User
