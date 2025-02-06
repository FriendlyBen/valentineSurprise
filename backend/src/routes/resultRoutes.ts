import { Router } from 'express';
import { saveResult} from '../controllers/resultController';

const router = Router();

router.post('/save', saveResult);  // Save a quiz result


export default router;
