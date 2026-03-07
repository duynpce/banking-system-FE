import '@testing-library/jest-dom'
import { beforeAll, afterAll } from "vitest";
import { server } from './test/mocks/server';

beforeAll(() => server.listen({
   onUnhandledRequest: 'warn' 
  }));

afterAll(() => {
  server.resetHandlers();
  server.close();
});