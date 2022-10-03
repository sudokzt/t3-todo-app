import { Task as TaskModel } from "@prisma/client";
import { useCallback, useRef, useState } from "react";
import { ToastValue, TOAST_TYPE } from "../../../utils/hooks/shared/useToast";
import { trpc } from "../../../utils/trpc";

export const TASK_STATUS = {
  ALL: "ALL",
  TODO: "TODO",
  DONE: "DONE",
} as const;
export type TASK_STATUS = keyof typeof TASK_STATUS;

type Props = {
  task: TaskModel;
  refetchTaskList: () => Promise<void>;
  handleChangeToast: (props: ToastValue) => void;
};

export const Task: React.FC<Props> = ({
  task,
  refetchTaskList,
  handleChangeToast,
}) => {
  const [editingTask, setEditingTask] = useState({ id: "", title: "" });

  const deleteTaskMutation = trpc.useMutation(["todo.delete"], {
    onSuccess() {
      handleChangeToast({
        text: "Succeed to delete task.",
        type: TOAST_TYPE.SUCCESS,
      });
      refetchTaskList();
    },
    onError: () => {
      handleChangeToast({
        text: "Failed to delete task.",
        type: TOAST_TYPE.FAILED,
      });
    },
  });
  const toggleTaskStatusMutation = trpc.useMutation(["todo.toggle"], {
    onSuccess() {
      refetchTaskList();
    },
    onError: () => {
      handleChangeToast({
        text: "Failed to change task status.",
        type: TOAST_TYPE.FAILED,
      });
    },
  });
  const editTaskMutation = trpc.useMutation(["todo.edit"], {
    onSuccess() {
      handleChangeToast({
        text: "Succeed to edit task.",
        type: TOAST_TYPE.SUCCESS,
      });
      refetchTaskList();
    },
    onError: (error) => {
      handleChangeToast({
        text: JSON.parse(error.message)[0].message,
        type: TOAST_TYPE.FAILED,
      });
    },
  });

  const handleDoubleClickTaskTitle = useCallback(
    (taskId: string, taskTitle: string) => {
      setEditingTask({ id: taskId, title: taskTitle });
    },
    [setEditingTask]
  );

  const editInputTaskRef = useRef<HTMLInputElement>(null);

  return (
    <div key={task.id} className="mb-2 flex items-center last:mb-0">
      <input
        type="checkbox"
        className="mr-4 h-8 w-8"
        checked={task.status === TASK_STATUS.DONE}
        onChange={() => {
          toggleTaskStatusMutation.mutate({
            id: task.id,
            status:
              task.status === TASK_STATUS.TODO
                ? TASK_STATUS.DONE
                : TASK_STATUS.TODO,
          });
        }}
      />
      {editingTask.id === task.id ? (
        <input
          ref={editInputTaskRef}
          type="text"
          defaultValue={editingTask.title}
          className={`mr-4 w-full rounded border p-2`}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              if (editInputTaskRef.current) {
                await editTaskMutation.mutate({
                  id: task.id,
                  title: editInputTaskRef.current.value,
                });

                setEditingTask({ id: "", title: "" });
                editInputTaskRef.current.value = "";
              }
            } else if (e.key == "Escape" || e.key === "Esc") {
              // Esc: for IE/Edge specific value
              setEditingTask({ id: "", title: "" });
              if (editInputTaskRef.current) {
                editInputTaskRef.current.value = "";
              }
            }
          }}
        />
      ) : (
        <p
          onDoubleClick={() => handleDoubleClickTaskTitle(task.id, task.title)}
          className={`mr-4 w-full rounded p-2 hover:bg-purple-300 ${
            task.status === TASK_STATUS.DONE
              ? "text-slate-300 line-through"
              : ""
          }`}
        >
          {task.title}
        </p>
      )}
      <button
        type="submit"
        className="rounded bg-purple-300 p-2 px-4"
        onClick={async () => {
          await deleteTaskMutation.mutate({ id: task.id });
        }}
      >
        Delete
      </button>
    </div>
  );
};
