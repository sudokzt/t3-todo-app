import { useRef, useState } from "react";
import { ToastValue, TOAST_TYPE } from "../../../utils/hooks/shared/useToast";
import { trpc } from "../../../utils/trpc";

type Props = {
  refetchTaskList: () => Promise<void>;
  handleChangeToast: (props: ToastValue) => void;
};

export const Input: React.FC<Props> = ({
  refetchTaskList,
  handleChangeToast,
}) => {
  const [inputTitle, setInputTitle] = useState("");

  const createTaskMutation = trpc.useMutation(["todo.create"], {
    async onSuccess() {
      handleChangeToast({
        text: "Succeed to create task.",
        type: TOAST_TYPE.SUCCESS,
      });
      await refetchTaskList();
    },
    onError: (error) => {
      handleChangeToast({
        text: JSON.parse(error.message)[0].message,
        type: TOAST_TYPE.FAILED,
      });
    },
  });

  const createInputTaskRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex">
      <input
        ref={createInputTaskRef}
        type="text"
        placeholder={"input task"}
        className="mr-2 w-full rounded border p-2"
        onChange={(e) => setInputTitle(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();

            await createTaskMutation.mutate({ title: inputTitle });

            setInputTitle("");
            if (createInputTaskRef.current) {
              createInputTaskRef.current.value = "";
            }
          }
        }}
      />
      <button
        type="submit"
        className="rounded bg-purple-300 p-2 px-6 text-2xl"
        onClick={async () => {
          await createTaskMutation.mutate({ title: inputTitle });

          setInputTitle("");
          if (createInputTaskRef.current) {
            createInputTaskRef.current.value = "";
          }
        }}
      >
        Add
      </button>
    </div>
  );
};
