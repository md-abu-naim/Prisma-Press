import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { IRegisterUser } from "./user.interface";

const registerUserIntoDB = async (payload: IRegisterUser) => {
    const { name, email, password, profilePhoto } = payload

    const isUserExists = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExists) {
        throw new Error('User with this email already exists')
    }

    const hassedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hassedPassword
        }
    })

    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    return user
}


export const userService = {
    registerUserIntoDB
}