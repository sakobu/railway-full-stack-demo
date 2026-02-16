import express from "express";
import cors from "cors";
import { validate, formatErrors } from "@railway-ts/pipelines/schema";
import { pipeAsync } from "@railway-ts/pipelines/composition";
import { ok, err, flatMapWith, match } from "@railway-ts/pipelines/result";
import { registrationSchema, type Registration } from "@demo/shared/schema";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Fake DB ──────────────────────────────────────────────────────────────────

const takenUsernames = new Set(["admin", "root", "test"]);
const takenEmails = new Set(["taken@example.com"]);
const users: Registration[] = [];

// ── Username availability ────────────────────────────────────────────────────

app.get("/api/check-username", async (req, res) => {
  const username = String(req.query.u ?? "");
  // simulate latency
  await new Promise((r) => setTimeout(r, 400));
  res.json({ available: !takenUsernames.has(username.toLowerCase()) });
});

// ── Registration pipeline ────────────────────────────────────────────────────

const checkEmailUnique = async (data: Registration) => {
  if (takenEmails.has(data.email.toLowerCase())) {
    return err([{ path: ["email"], message: "Email already registered" }]);
  }
  return ok(data);
};

const persistUser = async (data: Registration) => {
  // simulate write
  await new Promise((r) => setTimeout(r, 100));
  users.push(data);
  takenUsernames.add(data.username.toLowerCase());
  takenEmails.add(data.email.toLowerCase());
  return ok({ id: users.length, username: data.username });
};

app.post("/api/register", async (req, res) => {
  const result = await pipeAsync(
    validate(req.body, registrationSchema),
    flatMapWith(checkEmailUnique),
    flatMapWith(persistUser),
  );

  const { status, body } = match(result, {
    ok: (user) => {
      console.log("Registered:", user);
      return { status: 201 as const, body: { user } };
    },
    err: (errors) => ({
      status: 422 as const,
      body: formatErrors(errors),
    }),
  });

  res.status(status).json(body);
});

// ── Start ────────────────────────────────────────────────────────────────────

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
