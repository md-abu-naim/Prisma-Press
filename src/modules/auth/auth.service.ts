import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { ILoginUser } from "./auth.interface"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config"
import { jwtUtils } from "../../utils/jwt"

const loginUserIntoDB = async (payload: ILoginUser) => {
    const { email, password } = payload

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.activeStatus === "BLOCEKD") {
        throw new Error('Your account has been blocked. Pleas contact support')
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password)

    if (!isMatchedPassword) {
        throw new Error('Password is incorrect')
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {expiresIn: config.jwt_access_expires_in} as SignOptions)

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)

    // const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {expiresIn: config.jwt_refresh_expires_in} as SignOptions)
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in as SignOptions)


    return { accessToken, refreshToken }
}

// const refreshTokenInDB = async(refreshToken: string) => {
//     const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret)

//     if(!verifiedRefreshToken.success){
//         throw new Error(verifiedRefreshToken.error)
//     }

//     const {id} = verifiedRefreshToken.data as JwtPayload

//     const user = await prisma.user.findUniqueOrThrow({
//         where: {
//             id
//         }
//     })

//     if(user.activeStatus === 'BLOCEKD'){
//         throw new Error('User is Blocked')
//     }

//     const jwtPayload = {
//         id, 
//         name: user.name,
//         email: user.email,
//         role: user.role
//     }

//     const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)

//     return {accessToken}
// }

const refreshToken = async (refreshToken : string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if(!verifiedRefreshToken.success){
        throw new Error(verifiedRefreshToken.error)
    }

    const {id} = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id
        }
    })

    if(user.activeStatus === "BLOCEKD"){
        throw new Error("User is blocked!")
    }

    const jwtPayload = {
        id,
        name : user.name,
        email : user.email,
        role : user.role
    }


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    return {accessToken}
}



export const authService = {
    loginUserIntoDB, refreshToken
}