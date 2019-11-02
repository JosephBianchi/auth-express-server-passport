const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define our model

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

// on save hook, encrypt password
userSchema.pre('save', function(next){
  bcrypt.genSalt(10, (err, salt) => {
    console.log(this);
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password, salt, null, (err, hash) => {
      console.log(this);
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback){

  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch)
  })
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
