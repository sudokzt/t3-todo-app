import { beforeEach, describe, expect, test } from "vitest";

import { appRouter } from ".";
import { inferMutationInput, inferQueryInput } from "../../utils/trpc";
import { CreateContextInner, createContextInner } from "./context";
import { TASK_STATUS } from "./todo";

type LocalTestContext = {
  ctx: CreateContextInner;
};

beforeEach<LocalTestContext>(async (ctx) => {
  ctx.ctx = await createContextInner({
    session: {
      user: {
        id: "mock-user-id",
        email: "mock-email",
        image: "mock-image",
        name: "mock-name",
      },
      expires: "",
    },
  });
  await ctx.ctx.prisma.task.deleteMany({});
});

describe("todo", () => {
  test<LocalTestContext>("add todo task and list", async (ctx) => {
    const caller = appRouter.createCaller(ctx.ctx);
    const inputForList: inferQueryInput<"todo.list"> = {
      status: "ALL",
    };
    const tasks = await caller.query("todo.list", inputForList);
    expect(tasks.length).toBe(0);

    const inputForCreate1: inferMutationInput<"todo.create"> = {
      title: "new task",
    };
    const createdTask = await caller.mutation("todo.create", inputForCreate1);
    expect(createdTask).toMatchObject({
      id: expect.anything(),
      userId: "mock-user-id",
      title: "new task",
      status: TASK_STATUS.TODO,
      isDeleted: false,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    });

    const updatedTasks = await caller.query("todo.list", inputForList);
    expect(updatedTasks).toMatchObject([
      {
        id: expect.anything(),
        userId: "mock-user-id",
        isDeleted: false,
        status: TASK_STATUS.TODO,
        title: "new task",
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);

    const inputForCreate2: inferMutationInput<"todo.create"> = {
      title: "new task2",
    };
    await caller.mutation("todo.create", inputForCreate2);
    const updatedTasks2 = await caller.query("todo.list", inputForList);
    expect(updatedTasks2.length).toBe(2);
  });

  test<LocalTestContext>("toggle the task status", async (ctx) => {
    const caller = appRouter.createCaller(ctx.ctx);
    const inputForList: inferQueryInput<"todo.list"> = {
      status: "ALL",
    };
    await caller.query("todo.list", inputForList);

    const inputForCreate1: inferMutationInput<"todo.create"> = {
      title: "new task",
    };
    const createdTask = await caller.mutation("todo.create", inputForCreate1);

    const updatedTasks = await caller.query("todo.list", inputForList);
    console.log({ updatedTasks });
    expect(updatedTasks).toMatchObject([
      {
        id: expect.anything(),
        userId: "mock-user-id",
        isDeleted: false,
        status: TASK_STATUS.TODO,
        title: "new task",
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);

    const updateForCreatedTask: inferMutationInput<"todo.toggle"> = {
      id: createdTask.id,
      status: TASK_STATUS.DONE,
    };
    await caller.mutation("todo.toggle", updateForCreatedTask);

    const updatedTasks2 = await caller.query("todo.list", inputForList);
    expect(updatedTasks2).toMatchObject([
      {
        id: expect.anything(),
        userId: "mock-user-id",
        isDeleted: false,
        status: TASK_STATUS.DONE,
        title: "new task",
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);

    const updateForCreatedTask2: inferMutationInput<"todo.toggle"> = {
      id: createdTask.id,
      status: TASK_STATUS.TODO,
    };
    await caller.mutation("todo.toggle", updateForCreatedTask2);

    const updatedTasks3 = await caller.query("todo.list", inputForList);
    expect(updatedTasks3).toMatchObject([
      {
        id: expect.anything(),
        userId: "mock-user-id",
        isDeleted: false,
        status: TASK_STATUS.TODO,
        title: "new task",
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);
  });

  test<LocalTestContext>("edit the task title", async (ctx) => {
    const caller = appRouter.createCaller(ctx.ctx);
    const inputForList: inferQueryInput<"todo.list"> = {
      status: "ALL",
    };
    await caller.query("todo.list", inputForList);

    const inputForCreate1: inferMutationInput<"todo.create"> = {
      title: "new task",
    };
    const createdTask = await caller.mutation("todo.create", inputForCreate1);

    const updatedTasks = await caller.query("todo.list", inputForList);
    expect(updatedTasks).toMatchObject([
      {
        id: expect.anything(),
        userId: "mock-user-id",
        isDeleted: false,
        status: TASK_STATUS.TODO,
        title: "new task",
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);

    const updateForCreatedTask: inferMutationInput<"todo.edit"> = {
      id: createdTask.id,
      title: "update title",
    };
    await caller.mutation("todo.edit", updateForCreatedTask);

    const updatedTasks2 = await caller.query("todo.list", inputForList);
    expect(updatedTasks2).toMatchObject([
      {
        id: expect.anything(),
        userId: "mock-user-id",
        isDeleted: false,
        status: TASK_STATUS.TODO,
        title: "update title",
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);
  });

  test<LocalTestContext>("delete the task", async (ctx) => {
    const caller = appRouter.createCaller(ctx.ctx);
    const inputForList: inferQueryInput<"todo.list"> = {
      status: "ALL",
    };
    const tasks = await caller.query("todo.list", inputForList);
    expect(tasks.length).toBe(0);

    const inputForCreate1: inferMutationInput<"todo.create"> = {
      title: "new task",
    };
    const createdTask = await caller.mutation("todo.create", inputForCreate1);

    const updatedTasks1 = await caller.query("todo.list", inputForList);
    await caller.query("todo.list", inputForList);
    expect(updatedTasks1.length).toBe(1);

    const updateForCreatedTask: inferMutationInput<"todo.delete"> = {
      id: createdTask.id,
    };
    await caller.mutation("todo.delete", updateForCreatedTask);

    const updatedTasks2 = await caller.query("todo.list", inputForList);
    expect(updatedTasks2.length).toBe(0);
  });
});
