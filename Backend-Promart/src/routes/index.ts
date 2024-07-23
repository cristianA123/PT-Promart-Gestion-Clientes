import { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import authController from '../controller/auth.controller';
import clientController from '../controller/client.cotroller';

const routers = (app: Express, prisma: PrismaClient) => {
    app.use('/api/auth', authController(prisma));
    app.use('/api/client', clientController(prisma));
};

export = routers;