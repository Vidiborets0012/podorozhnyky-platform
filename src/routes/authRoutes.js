import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// router.post('/auth/logout', authenticate, logoutUser);

// router.post('/auth/refresh', refreshUserSession);

router.post('/register', celebrate(registerUserSchema), registerUser);

router.post('/login', celebrate(loginUserSchema), loginUser);

router.post('/logout', authenticate, logoutUser);

router.post('/refresh', refreshUserSession);

export default router;
