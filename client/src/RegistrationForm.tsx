import { useForm } from "@railway-ts/use-form";
import { ROOT_ERROR_KEY } from "@railway-ts/pipelines/schema";
import { registrationSchema, type Registration } from "@demo/shared/schema";

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
        <label htmlFor={form.getFieldProps("username").id}>Username</label>
        <input
          type="text"
          placeholder="john doe"
          autoComplete="username"
          {...form.getFieldProps("username")}
        />
        {form.validatingFields.username && (
          <span className="checking">Checking availability…</span>
        )}
        {form.touched.username && form.errors.username && (
          <span className="error">{form.errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="field">
        <label htmlFor={form.getFieldProps("email").id}>Email</label>
        <input
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          {...form.getFieldProps("email")}
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="field">
        <label htmlFor={form.getFieldProps("password").id}>Password</label>
        <input
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          {...form.getFieldProps("password")}
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="field">
        <label htmlFor={form.getFieldProps("confirmPassword").id}>
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Re-enter password"
          autoComplete="new-password"
          {...form.getFieldProps("confirmPassword")}
        />
        {form.touched.confirmPassword && form.errors.confirmPassword && (
          <span className="error">{form.errors.confirmPassword}</span>
        )}
      </div>

      {/* Age */}
      <div className="field">
        <label htmlFor={form.getFieldProps("age").id}>Age</label>
        <input
          type="number"
          min={0}
          max={120}
          placeholder="18"
          {...form.getFieldProps("age")}
        />
        {form.touched.age && form.errors.age && (
          <span className="error">{form.errors.age}</span>
        )}
      </div>

      {/* Contact Methods */}
      <fieldset className="field">
        <legend>Contact Methods (Optional)</legend>
        <div className="checkbox-group">
          {(["email", "phone", "sms"] as const).map((method) => (
            <label
              key={method}
              htmlFor={form.getCheckboxGroupOptionProps("contacts", method).id}
            >
              <input
                type="checkbox"
                {...form.getCheckboxGroupOptionProps("contacts", method)}
              />
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Form-level errors */}
      {form.errors[ROOT_ERROR_KEY] && (
        <div className="form-error">{form.errors[ROOT_ERROR_KEY]}</div>
      )}

      <button type="submit" disabled={form.isSubmitting || form.isValidating}>
        {form.isSubmitting ? "Registering…" : "Create Account"}
      </button>
    </form>
  );
}
