import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState, useMemo } from "react";
import { FilterList } from "../components/features/todoList/FilterList";
import { Input } from "../components/features/todoList/Input";
import { List } from "../components/features/todoList/List";
import { TASK_STATUS } from "../components/features/todoList/Task";
import { useToast } from "../utils/hooks/shared/useToast";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session } = useSession();

  // TODO: move to global state(e.g. ToastProvider context)
  const [Toast, handleChangeToast] = useToast();

  const [taskStatusFilter, setTaskStatusFilter] = useState<TASK_STATUS>(
    TASK_STATUS.ALL
  );

  const tasks = trpc.useQuery(["todo.list", { status: taskStatusFilter }]);

  const isSignedIn = useMemo(() => session?.user != null, [session]);

  return (
    <>
      <Head>
        <title>TODO App</title>
        <meta name="description" content="t3-todo-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen w-full flex-col items-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          <span className="text-purple-300">TODO</span>
        </h1>

        {!isSignedIn ? (
          <button
            onClick={async () => await signIn()}
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Sign in
          </button>
        ) : (
          <>
            <div className="mt-6 w-full">
              <Input
                refetchTaskList={async () => {
                  await tasks.refetch();
                }}
                handleChangeToast={handleChangeToast}
              />
            </div>

            <div className="mt-6 w-full">
              <FilterList
                filter={taskStatusFilter}
                refetchTaskList={async () => {
                  await tasks.refetch();
                }}
                handleChangeFilter={setTaskStatusFilter}
              />
            </div>

            <div className="mt-2 w-full px-2">
              <List
                tasks={tasks.data ?? []}
                isLoading={tasks.isLoading}
                refetchTaskList={async () => {
                  await tasks.refetch();
                }}
                handleChangeToast={handleChangeToast}
              />
            </div>

            <div className="mt-4 w-full border-t border-gray-700">
              <button
                onClick={async () => await signOut()}
                className="mt-4 rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </>
        )}

        <Toast />
      </main>
    </>
  );
};

export default Home;
