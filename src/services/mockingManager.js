import { faker } from '@faker-js/faker';

faker.locale = 'es';

export const generateProducts = () => {
    return{
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        thumbnails: faker.image.image()
        
    }
}

