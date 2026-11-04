import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app-factory.js';

let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    appPromise ??= createApp();
    const app = await appPromise;
    const expressApp = app.getHttpAdapter().getInstance();

    return expressApp(request, response);
  } catch (error) {
    appPromise = undefined;
    console.error("Failed to initialize NestJS application", error);
    return response.status(500).json({
      message: "Failed to initialize backend",
    });
  }
}
