const {validateToken } = require('../service/authentication')
function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
      const tokenCookieValue = req.cookies[cookieName];
      if(!tokenCookieValue){
       return next();
      }
      try {
        const userPayload = validateToken(tokenCookieValue);
              req.user = userPayload;
              // console.log('Authentication successful:', userPayload);
                //  return next();
      } catch (error) {
        // console.error("Error validating token:", error.message);

        // // Clear invalid token and optionally redirect to login
        // res.clearCookie(cookieName); 
        // return res.redirect("/login"); 
      }
       return next();
 }
}

module.exports = { checkForAuthenticationCookie }
