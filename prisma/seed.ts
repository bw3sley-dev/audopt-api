import { PrismaClient } from '@prisma/client';

import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hash('#esqueci321#', 6);

    await prisma.org.createMany({
        data: [
            {
                id: '1',
                name: 'Helping Paws',
                owner_name: 'John Doe',
                email: 'john.doe@example.com',
                password: hashedPassword,
                phone: '1234567890',
                postal_code: '12345678',
                street: '123 Main St',
                coordinate_x: '34.0522',
                coordinate_y: '-118.2437',
                created_at: new Date(),
            },
            {
                id: '2',
                name: 'Animal Rescue Center',
                owner_name: 'Jane Smith',
                email: 'jane.smith@example.com',
                password: hashedPassword,
                phone: '0987654321',
                postal_code: '87654321',
                street: '456 Oak St',
                coordinate_x: '40.7128',
                coordinate_y: '-74.0060',
                created_at: new Date(),
            },
            {
                id: '3',
                name: 'Pet Haven',
                owner_name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                password: hashedPassword,
                phone: '1122334455',
                postal_code: '11223344',
                street: '789 Pine St',
                coordinate_x: '37.7749',
                coordinate_y: '-122.4194',
                created_at: new Date(),
            },
        ],
    });

    console.log('Database seeded with 3 organizations.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
