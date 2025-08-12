import { createContainer, asClass, asValue, asFunction } from 'awilix';
import db from './app/database/connection.js';
import dotenv from 'dotenv';
import buildInsertQuery from './app/database/helpers/buildInsertQuery.js'
import buildUpdateQuery from './app/database/helpers/buildUpdateQuery.js'
import DBAsyncHelpers from './app/database/helpers/DBAsyncHelpers.js'
import UserRepository from './app/repositories/UserRepository.js';
import UserValidators from './app/utils/validators/UserValidators.js';
import AuthService from './app/services/AuthService.js';
import UserService from './app/services/UserService.js';

dotenv.config({ path:'./.env' });
const container = createContainer();

container.register({
  // Database & Config
  db: asValue(db),
  jwtSecret: asValue(process.env.JWT_SECRET),
  jwtExpiration: asValue(process.env.JWT_EXPIRATION),

  // Helpers & Utils
  buildInsertQuery: asFunction(() => buildInsertQuery).singleton(),
  buildUpdateQuery: asFunction(() => buildUpdateQuery).singleton(),
  dbAsyncHelpers: asClass(DBAsyncHelpers).scoped(),
  userValidators: asClass(UserValidators).scoped(),

  // Repositories
  userRepository: asClass(UserRepository).scoped(),
  
  // Services
  authService: asClass(AuthService).scoped(),
  userService: asClass(UserService).scoped(),
});

export default container;
