import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  // 1. ПЕРЕВІРКА: чи є взагалі токен?
  if (!req.cookies.accessToken) {
    // throw createHttpError(401, 'Missing access token');
    // ЯК БУЛО: throw createHttpError(401, 'Missing access token');
    // ЯК ТРЕБА: просто пропускаємо далі без помилки
    return next();
  }

  // 2. Якщо токен є — валідуємо його
  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });

  if (!session) {
    // Якщо токен є, але сесії в базі немає — кидаємо помилку
    throw createHttpError(401, 'Session not found');
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // 3. Записуємо користувача в req
  req.user = user;

  next();
};
