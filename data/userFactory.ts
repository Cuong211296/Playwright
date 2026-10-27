import { faker } from '@faker-js/faker';

export function createUser(){
    return {
        username: `Cuong_${Date.now()}`,
        password: faker.internet.password({length: 10}),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        dob: faker.date.birthdate({ min: 10, max: 90, mode: 'age'}).toISOString().slice(0, 10),
    };

}