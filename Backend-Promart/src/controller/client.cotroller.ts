import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import SecurityMiddleware from '../middleware/security.middleware';
import LogginMiddleware from '../middleware/loggin.middleware';
import ClientManager from '../manager/client.manager';

const clientController = (prisma: PrismaClient) => {
    const clientManager = new ClientManager(prisma);
    const securityHandler = new SecurityMiddleware();
    const logginHandler = new LogginMiddleware();

    const router = Router();

    router.use(logginHandler.loggingMiddleware);

    router.get('/', securityHandler.validateToken.bind(securityHandler), clientManager.clients.bind(clientManager));
    router.get('/:id', securityHandler.validateToken.bind(securityHandler), clientManager.clientById.bind(clientManager));
    router.post('/', securityHandler.validateToken.bind(securityHandler), clientManager.createClient.bind(clientManager));
    router.put('/:id', securityHandler.validateToken.bind(securityHandler), clientManager.updateClient.bind(clientManager));
    router.delete('/:id', securityHandler.validateToken.bind(securityHandler), clientManager.deleteClient.bind(clientManager));
    router.post('/change-state', securityHandler.validateToken.bind(securityHandler), clientManager.changeClientStatus.bind(clientManager));

    return router;
};

export default clientController;