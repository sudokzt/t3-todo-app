import { Task as TaskModel } from "@prisma/client";
import { ToastValue } from "../../../utils/hooks/shared/useToast";
import { Task } from "./Task";

type Props = {
  tasks: TaskModel[];
  isLoading: boolean;
  refetchTaskList: () => Promise<void>;
  handleChangeToast: (props: ToastValue) => void;
};

export const List: React.FC<Props> = ({
  tasks,
  isLoading,
  refetchTaskList,
  handleChangeToast,
}) =>
  isLoading ? (
    <p>Loading...</p>
  ) : (
    <>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          refetchTaskList={refetchTaskList}
          handleChangeToast={handleChangeToast}
        />
      ))}
    </>
  );
