import { z } from 'zod';
import i18n from 'i18next';

export const emailSchema = z
  .string()
  .min(1, i18n.t('validation.emailRequired'))
  .email(i18n.t('validation.emailInvalid'));

export const passwordSchema = z
  .string()
  .min(8, i18n.t('validation.passwordMin'))
  .regex(/[A-Z]/, i18n.t('validation.passwordUpper'))
  .regex(/[0-9]/, i18n.t('validation.passwordNumber'));

export const nameSchema = z.string().min(1, i18n.t('validation.nameRequired')).max(50, i18n.t('validation.nameMax'));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, i18n.t('validation.passwordRequired')),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const profileSchema = z.object({
  name: nameSchema,
  about: z.string().max(150, i18n.t('validation.aboutMax')).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
