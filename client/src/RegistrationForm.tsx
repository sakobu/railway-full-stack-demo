import { useForm } from "@railway-ts/use-form";
import { ROOT_ERROR_KEY } from "@railway-ts/pipelines/schema";
import { registrationSchema, type Registration } from "@demo/shared/schema";
import { Input, Label, Button, ErrorMessage, CheckboxGroup } from "./components";

export function RegistrationForm() {
  const form = useForm<Registration>(registrationSchema, {
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: null,
      contacts: [],
    },
    fieldValidators: {
      username: async (value) => {
        try {
          const res = await fetch(
            `/api/check-username?u=${encodeURIComponent(value)}`,
          );
          const { available } = await res.json();
          return available ? undefined : "Username is already taken";
        } catch {
          return "Unable to check username availability";
        }
      },
      confirmPassword: (value, values) => {
        if (value && value !== values.password) {
          return "Passwords must match";
        }
        return undefined;
      },
    },
    onSubmit: async (values) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errors = await res.json();
        form.setServerErrors(errors);
        return;
      }

      const data = await res.json();
      console.log("Registered:", data);
      form.resetForm();
    },
  });

  return (
    <form onSubmit={(e) => void form.handleSubmit(e)}>
      {/* Username */}
      <div className="field">
        <Label htmlFor={form.getFieldProps("username").id}>Username</Label>
        <Input
          type="text"
          placeholder="john doe"
          autoComplete="username"
          {...form.getFieldProps("username")}
        />
        {form.validatingFields.username && (
          <span className="checking">Checking availability…</span>
        )}
        <ErrorMessage
          message={form.touched.username ? form.errors.username : undefined}
        />
      </div>

      {/* Email */}
      <div className="field">
        <Label htmlFor={form.getFieldProps("email").id}>Email</Label>
        <Input
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          {...form.getFieldProps("email")}
        />
        <ErrorMessage
          message={form.touched.email ? form.errors.email : undefined}
        />
      </div>

      {/* Password */}
      <div className="field">
        <Label htmlFor={form.getFieldProps("password").id}>Password</Label>
        <Input
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          {...form.getFieldProps("password")}
        />
        <ErrorMessage
          message={form.touched.password ? form.errors.password : undefined}
        />
      </div>

      {/* Confirm Password */}
      <div className="field">
        <Label htmlFor={form.getFieldProps("confirmPassword").id}>
          Confirm Password
        </Label>
        <Input
          type="password"
          placeholder="Re-enter password"
          autoComplete="new-password"
          {...form.getFieldProps("confirmPassword")}
        />
        <ErrorMessage
          message={
            form.touched.confirmPassword
              ? form.errors.confirmPassword
              : undefined
          }
        />
      </div>

      {/* Age */}
      <div className="field">
        <Label htmlFor={form.getFieldProps("age").id}>Age</Label>
        <Input
          type="number"
          min={0}
          max={120}
          placeholder="18"
          {...form.getFieldProps("age")}
        />
        <ErrorMessage
          message={form.touched.age ? form.errors.age : undefined}
        />
      </div>

      {/* Contact Methods */}
      <CheckboxGroup legend="Contact Methods (Optional)">
        {(["email", "phone", "sms"] as const).map((method) => (
          <label
            key={method}
            htmlFor={form.getCheckboxGroupOptionProps("contacts", method).id}
          >
            <Input
              type="checkbox"
              {...form.getCheckboxGroupOptionProps("contacts", method)}
            />
            {method.charAt(0).toUpperCase() + method.slice(1)}
          </label>
        ))}
      </CheckboxGroup>

      {/* Form-level errors */}
      {form.errors[ROOT_ERROR_KEY] && (
        <div className="form-error">{form.errors[ROOT_ERROR_KEY]}</div>
      )}

      <Button type="submit" disabled={form.isSubmitting || form.isValidating}>
        {form.isSubmitting ? "Registering…" : "Create Account"}
      </Button>
    </form>
  );
}
