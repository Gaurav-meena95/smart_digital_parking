const jwt  = require('jsonwebtoken')
const sec_key = process.env.sec_key

const verifyUserMiddleware = (req,res,next)=>{
    try {
        const Authheader = req.headers.authorization
        const refreshToken = req.headers['x-refresh-token']
        console.log('lkjefbs',req.headers)
        if (!Authheader){
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const [prefix,token] = Authheader.split(' ')

        if (!token){
            return res.status(401).json({ message: "Token is not valid" });
        }
        if (!prefix ){
            return res.status(401).json({ message: "Token is not valid" });
        }
        jwt.verify(token,sec_key,(error,decode)=>{
            if (error && error.name ==='TokenExpiredError'){
                if(!refreshToken){
                    return res.status(401).json({message :'RefreshToken is not Present'})
                }
                jwt.verify(refreshToken,sec_key,(error,decode)=>{
                    if (error){
                        return res.status(401).json({message:'Invalid refreshToken'})
                    }
                    const {accestoken,refreshToken:newRefreshToken} = generateNewToken(decode)
                    res.set('x-accestoken',accestoken)
                    res.set('x-refresh-token',newRefreshToken)
                    req.user = decode
                    next()
                })
            }else if(error){
                    return res.status(401).json({message :'invalid Token '})
            }else{
                req.user = decode
                next()
            }
        })
    } catch (error) {
        
    }
}

const generateNewToken = (decode)=>{
    const accestoken = jwt.sign(
        { id: decode.id, email: decode.email, role: decode.role },
        sec_key,
        {expiresIn: '1h'}
    )
    const newRefreshToken = jwt.sign(
        { id: decode.id, email: decode.email, role: decode.role },
        sec_key,
        {expiresIn: '1h'}
    )
    return {accestoken,newRefreshToken}
}

module.exports = {verifyUserMiddleware}