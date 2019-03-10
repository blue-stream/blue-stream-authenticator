import { Router } from 'express';
import { HealthController } from './health.controller';

const HealthRouter: Router = Router();

HealthRouter.get('/health', HealthController.healthCheck);

export { HealthRouter };
