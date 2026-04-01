import type {
  AuthResponse,
  AuthTokenResponsePassword,
} from '@supabase/supabase-js';
import type { AuthenticateUserDTO, CreateUserDTO } from './auth.types.js';
import { supabase } from '../../config/supabase.js';
import Boom from '@hapi/boom';

// Authentication of User
export const authenticateUserService = async (
  credentials: AuthenticateUserDTO
): Promise<AuthTokenResponsePassword['data']> => {
  const signInRes = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInRes.error) {
    throw Boom.unauthorized(
      signInRes.error.message + ", the credentials doesn't match any user."
    );
  }

  return signInRes.data;
};

//Creating User
export const createUserService = async (
  user: CreateUserDTO
): Promise<AuthResponse['data']> => {
  const signUpRes = await supabase.auth.signUp({
    email: user.email,
    phone: user.phone,
    password: user.password,
    options: {
      data: {
        name: user.name,
        role: user.role,
      },
    },
  });

  if (signUpRes.error) {
    throw Boom.badRequest(
      signUpRes.error.message + ', the user was not created'
    );
  }

  //Id del nuevo Usuario
  const newUserId = signUpRes.data.user?.id;

  if (newUserId) {
    const { error: insertionError } = await supabase.from('users').insert([
      {
        id: newUserId,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    ]);

    if (insertionError) {
      throw Boom.internal(
        'Could not create user profile' + insertionError.message
      );
    }
  }

  return signUpRes.data;
};
