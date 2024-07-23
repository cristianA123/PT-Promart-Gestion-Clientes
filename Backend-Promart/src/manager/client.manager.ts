import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ResponseDTO from '../DTO/response.dto';
import { textResponses } from '../shared/util/constants.util';
import AppError from '../shared/errors/app.error';
import { enumUtil } from '../shared/util/enum.util';
import PrismaHandler from '../handler/prisma.handler';
import ClientDTO from '../DTO/clientData.dto';

enum ClientState {
    PROSPECTO = "PROSPECTO",
    ACTIVO = "ACTIVO",
    INACTIVO = "INACTIVO",
    BLOQUEADO = "BLOQUEADO"
  }

const prismaHandler = new PrismaHandler();

class ClientManager {
    private prisma: PrismaClient;

    constructor(prisma:PrismaClient) {
        this.prisma = prisma;
    }

    public async clients(req: Request, res: Response, next: NextFunction): Promise<any> {

        try {
         
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} };

            const clients = await prismaHandler.executeQuery(async () => {
                return await this.prisma.client.findMany({
                    skip,
                    take: limit,
                    where: { isDeleted: false },
                });
            });

            const totalClients = await prismaHandler.executeQuery(async () => {
                return await this.prisma.client.count();
            });

            response.data.clients = clients;
            response.data.totalPages = Math.ceil(totalClients / limit);
            response.data.currentPage = page;

            res.status(200).send(response);
    
        } catch (error) {
            console.log("error Clientmanager.profile =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async clientById(req: Request, res: Response, next: NextFunction): Promise<any> {

        try {
            const { id } = req.params;
            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} };
    
            if (isNaN(Number(id))) {
                throw new AppError("El identificador del cliente no es valido", 400, enumUtil.badParametersInput);
            }

            if (id) {
                const client = await prismaHandler.executeQuery(async () => {
                    return await this.prisma.client.findUnique({ 
                        where: { id: +id }
                     })
                });

                if (client) {
                    response.data.client = client
                } else {
                    response.success = false
                    response.message = textResponses.incorrectCredentials
                }
                res.status(200).send(response);
            } else {
                throw new AppError(textResponses.badParameters, 400, enumUtil.badParametersInput);
            }
    
        } catch (error) {
            console.log("error Clientmanager.profile =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    
        try {
            const { 
                name,
                firstName,
                lastName,
                email,
                birthDay,
                state
            } = req.body;

            const [emailExists] = await Promise.all([
                this.checkIfExists('email', email),
            ]);

            if (emailExists) {
                throw new AppError("El email ya existe", 400, enumUtil.badParametersInput);
            }

            if (!this.isValidDate(birthDay)) {
                throw new AppError("La fecha de nacimiento no es valida", 400, enumUtil.badParametersInput);
            }

            if (!this.isAtLeast18YearsOld(birthDay)) {
                throw new AppError("Debe de ser mayor de edad para registrarse", 400, enumUtil.badParametersInput);
            }

            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} };
    
            if (name && firstName && email && birthDay) {
                const clienData: ClientDTO = {
                    name,
                    firstName,
                    lastName,
                    email,
                    state,
                    birthDay: this.convertToISODate(birthDay),
                }
    
                const client = await prismaHandler.executeQuery(async () => {
                    return await this.prisma.client.create({ data: clienData })
                });

                if (client) {
                    response.data.client = clienData
                } else {
                    response.success = false
                    response.message = textResponses.incorrectCredentials
                }
                res.status(200).send(response);
            } else {
                throw new AppError(textResponses.badParameters, 400, enumUtil.badParametersInput);
            }
    
        } catch (error) {
            console.log("error Clientmanager.createProfile =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async updateClient(req: Request, res: Response, next: NextFunction): Promise<any> {

        try {
            const {
                name,
                firstName,
                lastName,
                email,
                birthDay,
            } = req.body;

            const { id } = req.params;
            
            if (name && firstName && email && birthDay && id) {
            const clientExist = await prismaHandler.executeQuery(async () => {
                return await this.prisma.client.findUnique({
                    where: { id: +id },
                });
            });

            if (!clientExist) {
                throw new AppError("No se pudo encontrar cliente con ese indicador", enumUtil.badParametersInput);
            }

            if (email && email !== clientExist.email) {
                const emailExists = await this.checkIfExists('email', email);
                if (emailExists) {
                    throw new AppError("El email ya existe", 400, enumUtil.badParametersInput);
                }
            }

            if (!this.isValidDate(birthDay)) {
                throw new AppError("La fecha de nacimiento no es valida", 400, enumUtil.badParametersInput);
            }

            if (!this.isAtLeast18YearsOld(birthDay)) {
                throw new AppError("Debe de ser mayor de edad para registrarse", 400, enumUtil.badParametersInput);
            }

            const response: ResponseDTO = { success: true, message: textResponses.success, data: {} };
    
                const clienData: ClientDTO = {
                    name,
                    firstName,
                    lastName,
                    email,
                    birthDay: this.convertToISODate(birthDay),
                    stateUpdatedAt: new Date(),
                }
    
                const client = await prismaHandler.executeQuery(async () => {
                    return await this.prisma.client.update({ 
                        where: { id: +id },
                        data: clienData })
                });

                if (client) {
                    response.data.client = clienData
                } else {
                    response.success = false
                    response.message = textResponses.incorrectCredentials
                }
                res.status(200).send(response);
            } else {
                throw new AppError(textResponses.badParameters, 400, enumUtil.badParametersInput);
            }
    
        } catch (error) {
            console.log("error Clientmanager.updateUser =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {id} = req.params;
        try{
            const response:ResponseDTO = { success: true, message:textResponses.deleteResponse, data: {} }

            if (isNaN(Number(id))) {
                throw new AppError("El identificador del cliente no es valido", 400, enumUtil.badParametersInput);
            }

            const clientExist = await prismaHandler.executeQuery(async () => {
                return await this.prisma.client.findUnique({
                    where: { id: +id },
                });
            });

            if (!clientExist) {
                throw new AppError("El cliente no se pudo encontrar", 400, enumUtil.badParametersInput);
            }

            const client = await prismaHandler.executeQuery(async () => {
                return await this.prisma.client.update({ 
                    where: { id: +id  },
                    data: {isDeleted: true} })
            });

            if(!client){
                response.success = false
                response.message = textResponses.incorrectCredentials
            }
            res.status(200).send(response);
        }catch(error){
            console.log("error usermanager.deleteUser =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    public async changeClientStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    
        try{
            const response:ResponseDTO = { success: true, message:textResponses.updatedResponse, data: {} }

            const { clientId, newState } = req.body;
            const userId = req.body.uuid;

            if (clientId && newState && userId) {
      
                const validTransitions: Record<string, string[]> = {
                [ClientState.PROSPECTO]: [ClientState.ACTIVO],
                [ClientState.ACTIVO]: [ClientState.INACTIVO],
                [ClientState.INACTIVO]: [ClientState.ACTIVO, ClientState.BLOQUEADO],
                [ClientState.BLOQUEADO]: [ClientState.ACTIVO] // Solo mediante autorización especial
                };
        
                const client = await this.prisma.client.findUnique({ where: { id: clientId } });
                if (!client) {
                throw new AppError("El cliente no se pudo encontrar", 400, enumUtil.badParametersInput);
                }
        
                if (!validTransitions[client.state!].includes(newState)) {
                throw new AppError("Transición de estado no permitida", 400, enumUtil.badParametersInput);
                }
        
                const user = await this.prisma.user.findUnique({ where: { uuid: userId } });
                if (!user) {
                throw new AppError("El usuario no se pudo encontrar", 400, enumUtil.badParametersInput);
                }
        
                if (client.state === ClientState.BLOQUEADO && newState === ClientState.ACTIVO && user.role !== "ADMIN") {
                throw new AppError("Transición de estado no permitida. Se requiere autorización especial", 403, enumUtil.errorAuth);
                }
        
                await this.prisma.client.update({
                where: { id: clientId },
                data: { state: newState, stateUpdatedAt: new Date() }
                });
        
                await this.prisma.changeClientState.create({
                data: {
                    state: newState,
                    clientId: clientId,
                    oldState: client.state,
                    newState: newState,
                    userId: user.id,
                    stateUpdatedAt: new Date()
                }
                });
            } else {
                throw new AppError(textResponses.badParameters, 400, enumUtil.badParametersInput);
            }
      
            res.status(200).json(response);
        }catch(error){
            console.log("error usermanager.changeClientStatus =", error);
            next(error instanceof AppError ? error : new AppError((error as Error).message, 500, enumUtil.functionalError));
        }
    }

    private isValidDate(birthDateString: string): boolean {
        const birthDate = new Date(birthDateString);
        const today = new Date();
    
        if (isNaN(birthDate.getTime())) {
            return false;
        }
    
        if (birthDate > today) {
            return false;
        }
    
        return true;
    }
    
    private isAtLeast18YearsOld(birthDateString: string): boolean {
        const birthDate = new Date(birthDateString);
        const today = new Date();
    
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
    
        if (age > 18 || (age === 18 && (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)))) {
            return true;
        }
    
        return false;
    }

    private convertToISODate(dateString: string): string {
        const date = new Date(dateString);
        return date.toISOString();
    }

    private async checkIfExists(field: string, value: string) {
        return await prismaHandler.executeQuery(async () => {
            return await this.prisma.client.findFirst({
                where: { [field]: value }
            });
        });
    }

}

export default ClientManager;