import type {
  AuthResponse,
  AuthTokenResponsePassword,
} from '@supabase/supabase-js';
import Boom from '@hapi/boom';
import { supabase, supabaseAdmin } from '../../config/supabase.js';
import type {
  AuthenticateUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  UserRole,
} from './auth.types.js';

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

type UpdateAuthenticationResponse = {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
};

export const updateAuthenticationService = async (
  userId: string,
  updates: UpdateUserDTO
): Promise<UpdateAuthenticationResponse> => {
  if (!supabaseAdmin) {
    throw Boom.internal(
      'SUPABASE_SERVICE_ROLE_KEY is required to update authentication data'
    );
  }

  const authPayload: {
    email?: string;
    password?: string;
    phone?: string;
    user_metadata?: {
      name?: string;
      role?: UserRole;
    };
  } = {};

  if (updates.email) authPayload.email = updates.email;
  if (updates.password) authPayload.password = updates.password;
  if (updates.phone) authPayload.phone = updates.phone;
  if (updates.name || updates.role) {
    authPayload.user_metadata = {};

    if (updates.name) authPayload.user_metadata.name = updates.name;
    if (updates.role) authPayload.user_metadata.role = updates.role;
  }

  if (Object.keys(authPayload).length > 0) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      authPayload
    );

    if (authError) {
      throw Boom.badRequest(authError.message);
    }
  }

  const profileUpdates: {
    email?: string;
    name?: string;
    phone?: string;
    role?: UserRole;
  } = {};

  if (updates.email) profileUpdates.email = updates.email;
  if (updates.name) profileUpdates.name = updates.name;
  if (updates.phone) profileUpdates.phone = updates.phone;
  if (updates.role) profileUpdates.role = updates.role;

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('users')
      .update(profileUpdates)
      .eq('id', userId);

    if (profileError) {
      throw Boom.badRequest(profileError.message);
    }
  }

  const response: UpdateAuthenticationResponse = { id: userId };

  if (updates.email) response.email = updates.email;
  if (updates.name) response.name = updates.name;
  if (updates.phone) response.phone = updates.phone;
  if (updates.role) response.role = updates.role;

  return response;
};

export const deleteUserService = async (
  userId: string
): Promise<{ message: string }> => {
  if (!supabaseAdmin) {
    throw Boom.internal(
      'SUPABASE_SERVICE_ROLE_KEY is required to delete users'
    );
  }

  const { error: profileError } = await supabase.from('users').delete().eq('id', userId);

  if (profileError) {
    throw Boom.badRequest(profileError.message);
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    throw Boom.badRequest(authError.message);
  }

  return { message: 'User deleted successfully' };
};
