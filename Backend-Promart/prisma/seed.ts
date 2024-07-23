import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    const userList = [
        {
            email: "admin@gmail.com",
            password: "123456",
            role: "ADMIN",
            uuid: uuidv4(),
        },
        {
            email: "user@gmail.com",
            password: "123456",
            role: "USER",
            uuid: uuidv4(),
        },
    ]

    await prisma.user.createMany({ data: userList })

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });