import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import UserDataDTO from '../DTO/userData.dto';
import ResponseDTO from '../DTO/response.dto';
import { textResponses } from '../shared/util/constants.util';
import SecurityMiddleware from '../middleware/security.middleware';
import AppError from '../shared/errors/app.error';
import { InternalServerError } from '../shared/util/error.util';
import { enumUtil } from '../shared/util/enum.util';
import PrismaHandler from '../handler/prisma.handler';


const prismaHandler = new PrismaHandler();

class AuthManager {
    private prisma: PrismaClient;
    private security: SecurityMiddleware;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.security = new SecurityMiddleware();
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body
        try {
            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} }

            if (!email || !password) {
                throw new InternalServerError(textResponses.badParameters, enumUtil.badParametersInput)
            }
            const user = await prismaHandler.executeQuery(async () => {
                return await this.prisma.user.findUnique({
                    select: { uuid: true }, where: { email: email, password: password }
                })
            });

            if (user) {
                const token = this.security.createToken(user.uuid)
                response.data.token = token
                response.data.uuid = user.uuid
            } else {
                response.success = false
                response.message = textResponses.incorrectCredentials
            }

            res.status(200).json(response);

        } catch (error) {
            console.log("error Authmanager.login =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { uuid } = req.body;
        try {
            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} }

            const user = await prismaHandler.executeQuery(async () => {
                return await this.prisma.user.findUnique({
                    where: { uuid: uuid }
                })
            });

            if (user) {
                response.data.user = user
                const token = this.security.createToken(user.uuid)
                response.data.token = token
            } else {
                response.success = false
                response.message = textResponses.incorrectCredentials
            }
            res.status(200).send(response);
        } catch (error) {
            console.log("error Authmanager.getProfile =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email } = req.params;
        const { uuid } = req.body;
        try {
            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} }

            const user = await prismaHandler.executeQuery(async () => {
                return await this.prisma.user.findUnique({
                    where: { email: email, uuid: uuid }
                })
            });

            if (user) {
                response.data.user = user
                const token = this.security.createToken(user.uuid)
                response.data.token = token
            } else {
                response.success = false
                response.message = textResponses.incorrectCredentials
            }
            res.status(200).send(response);
        } catch (error) {
            console.log("error Authmanager.getProfile =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, userName, password } = req.body;
        try {
            const response: ResponseDTO = { success: true, message: textResponses.createdResponse, data: {} };

            if (email && password && userName && typeof email === 'string') {
                const userData: UserDataDTO = {
                    email,
                    userName,
                    uuid: uuidv4(),
                    password: password
                };

                const [userExists, userNameExists] = await Promise.all([
                    this.checkIfExists('email', email),
                    this.checkIfExists('userName', userName)
                ]);

                if (userExists) {
                    throw new AppError("El email ya existe", 400, enumUtil.badParametersInput);
                }

                if (userNameExists) {
                    throw new AppError("El nombre de usuario ya existe", 400, enumUtil.badParametersInput);
                }

                const result = await this.prisma.$transaction(async (prisma) => {
                    const user = await prisma.user.create({ data: userData });
                    return user;
                });

                if (result) {
                    const token = this.security.createToken(result.uuid)
                    const { password, ...userWithoutPassword } = result;
                    response.data.user = userWithoutPassword;
                    response.data.token = token;
                } else {
                    response.success = false;
                    response.message = textResponses.incorrectCredentials;
                }
                res.status(200).send(response);
            } else {
                throw new AppError(textResponses.badParameters, 400, enumUtil.badParametersInput);
            }
        } catch (error) {
            console.log("error AuthManager.createUser =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    private async checkIfExists(field: string, value: string) {
        return await prismaHandler.executeQuery(async () => {
            return await this.prisma.user.findFirst({
                where: { [field]: value }
            });
        });
    }
}

export default AuthManager;