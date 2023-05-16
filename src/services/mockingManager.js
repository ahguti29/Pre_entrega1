import { faker } from '@faker-js/faker';

faker.locale = 'es';

export const generateProducts = () => {
    return{
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        id: faker.database.mongodbObjectId()
    }
}

