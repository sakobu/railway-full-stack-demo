import {
  object,
  required,
  optional,
  chain,
  string,
  nonEmpty,
  email,
  minLength,
  parseNumber,
  min,
  max,
  array,
  stringEnum,
  refineAt,
  type InferSchemaType,
  between,
  nullable,
  union,
} from "@railway-ts/pipelines/schema";

export const registrationSchema = chain(
  object({
    username: required(
      chain(string(), nonEmpty("Username is required"), minLength(3)),
    ),
    email: required(chain(string(), nonEmpty("Email is required"), email())),
    password: required(
      chain(string(), nonEmpty("Password is required"), minLength(8)),
    ),
    confirmPassword: required(
      chain(string(), nonEmpty("Please confirm your password")),
    ),
    age: required(
      chain(
        union([
          nullable(),
          chain(parseNumber(), min(18, "You must be at least 18")),
        ]),
      ),
    ),
    contacts: optional(array(stringEnum(["email", "phone", "sms"]))),
  }),
  refineAt(
    "confirmPassword",
    (data) => data.password === data.confirmPassword,
    "Passwords must match",
  ),
);

export type Registration = InferSchemaType<typeof registrationSchema>;
