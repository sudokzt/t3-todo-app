import { z } from "zod";
import { createProtectedRouter } from "./context";

export const TASK_STATUS = {
  ALL: "ALL",
  TODO: "TODO",
  DONE: "DONE",
} as const;

export const TaskStatusEnum = z.nativeEnum(TASK_STATUS);
export type TaskStatusEnum = z.infer<typeof TaskStatusEnum>;

export const todoRouter = createProtectedRouter()
  .query("list", {
    input: z.object({
      status: TaskStatusEnum,
    }),
    async resolve({ input, ctx }) {
      // If needed to return all tasks, return TODO and DONE tasks
      if (input.status === TASK_STATUS.ALL) {
        return await ctx.prisma.task.findMany({
          where: {
            OR: [
              {
                userId: ctx.session.user.id,
                status: TASK_STATUS.TODO,
                isDeleted: false,
              },
              {
                userId: ctx.session.user.id,
                status: TASK_STATUS.DONE,
                isDeleted: false,
              },
            ],
          },
        });
      } else {
        return await ctx.prisma.task.findMany({
          where: {
            userId: ctx.session.user.id,
            status: input.status,
            isDeleted: false,
          },
        });
      }
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().min(1, "should input more than 1 character"),
    }),
    async resolve({ input, ctx }) {
      const data = {
        title: input.title,
        status: TASK_STATUS.TODO,
        userId: ctx.session.user.id,
      };

      return await ctx.prisma.task.create({
        data: data,
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string().min(1, "should have more than 1 character"),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.update({
        where: {
          id_userId: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        },
        data: {
          isDeleted: true,
        },
      });
    },
  })
  .mutation("toggle", {
    input: z.object({
      id: z.string().min(1, "should have more than 1 character"),
      status: TaskStatusEnum,
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.update({
        where: {
          id_userId: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        },
        data: {
          status: input.status,
        },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().min(1, "should have more than 1 character"),
      title: z.string().min(1, "should input more than 1 character"),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.task.update({
        where: {
          id_userId: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        },
        data: {
          title: input.title,
        },
      });
    },
  });
