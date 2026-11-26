import { environment } from '../config/environment';

export const sauceDemoRoles = [
  'standard_user',
  'locked_out_user',
  'problem_user',
  'performance_glitch_user',
] as const;

export type SauceDemoRole = (typeof sauceDemoRoles)[number];

export interface SauceDemoUser {
  readonly role: SauceDemoRole;
  readonly username: SauceDemoRole;
  readonly password: string;
}

export function getSauceDemoUser(role: SauceDemoRole): SauceDemoUser {
  const password = environment.credentials.sauceDemoPassword;
  if (!password) {
    throw new Error('SAUCEDEMO_PASSWORD is required. Set it in your environment or .env file.');
  }

  return { role, username: role, password };
}
