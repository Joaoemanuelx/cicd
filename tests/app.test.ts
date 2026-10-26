
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app, resetTasks } from "../src/app";

afterEach(() => {
  resetTasks();
});

describe("GET /health", () => {
  it("retorna status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("Tasks API", () => {
  it("retorna uma lista vazia inicialmente", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("cria uma tarefa", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Estudar CI/CD" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      title: "Estudar CI/CD",
      completed: false
    });
  });

  it("rejeita um título vazio", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "   " });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("rejeita uma requisição sem título", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({});

    expect(response.status).toBe(400);
  });
});
