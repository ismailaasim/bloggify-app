//here we use the jwt token thats y create this folder    

const jwt = require('jsonwebtoken');

const secret = 'issu@1234$$%%%'

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role,
    };
    const token = jwt.sign(payload, secret);
    return token;
}

function validateToken(token){
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}