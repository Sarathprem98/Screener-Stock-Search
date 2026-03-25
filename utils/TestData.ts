import { faker } from '@faker-js/faker';

export class TestData {

    static randomCompany(): string {
        return faker.company.name();
    }

    static RandomString(): string {
        return faker.string.alpha(5);
    }

    static Extraspaces(): string {
        return `  ${faker.company.name().slice(0, 4).toUpperCase()}  `;
    }

    static specialChars(): string {
        return faker.string.symbol(4);
    }

    static longString(): string {
        return faker.string.alpha(120);
    }

    static BSEcode(): string {
    return faker.number.int({ min: 500100, max: 500199 }).toString();
    }
}
