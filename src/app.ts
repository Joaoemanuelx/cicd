
import express from "express";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const app = express();

app.use(express.json());

let tasks: Task[] = [];
let nextId = 1;

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/tasks", (_req, res) => {
  res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body as { title?: unknown };

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      error: "O título é obrigatório."
    });
  }

  const task: Task = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(task);

  return res.status(201).json(task);
});

// Tratamento básico para JSON inválido.
app.use((
  err: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    err.status === 400
  ) {
    return res.status(400).json({
      error: "JSON inválido."
    });
  }

  return next(err);
});

// Facilita o isolamento dos testes.
export function resetTasks(): void {
  tasks = [];
  nextId = 1;
}
