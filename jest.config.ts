import { Config } from '@jest/types'; // Import Jest Configuration type

const config: Config.InitialOptions = {
    preset: 'ts-jest', // Use ts-jest preset for TypeScript
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Customize as necessary
};

export default config; // Export the configuration