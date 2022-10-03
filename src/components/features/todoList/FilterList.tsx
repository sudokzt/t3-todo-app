import React, { Dispatch, SetStateAction, useCallback } from "react";
import { TASK_STATUS } from "./Task";

type Props = {
  filter: TASK_STATUS;
  handleChangeFilter: Dispatch<SetStateAction<TASK_STATUS>>;
  refetchTaskList: () => Promise<void>;
};

export const FilterList: React.FC<Props> = ({
  filter,
  handleChangeFilter,
  refetchTaskList,
}) => {
  const handleChangeFilterTaskStatus = useCallback(
    async (status: TASK_STATUS) => {
      handleChangeFilter(status);

      await refetchTaskList();
    },
    [handleChangeFilter, refetchTaskList]
  );

  return (
    <div className="flex">
      <div>
        <button
          type="button"
          onClick={() => handleChangeFilterTaskStatus(TASK_STATUS.ALL)}
        >
          <p
            className={`${
              filter === TASK_STATUS.ALL
                ? "underline decoration-purple-300 decoration-4"
                : ""
            }`}
          >
            {TASK_STATUS.ALL}
          </p>
        </button>
      </div>
      <p className="mx-2">|</p>
      <div>
        <button
          type="button"
          onClick={() => handleChangeFilterTaskStatus(TASK_STATUS.TODO)}
        >
          <p
            className={`${
              filter === TASK_STATUS.TODO
                ? "underline decoration-purple-300 decoration-4"
                : ""
            }`}
          >
            {TASK_STATUS.TODO}
          </p>
        </button>
      </div>
      <p className="mx-2">|</p>
      <div>
        <button
          type="button"
          onClick={() => handleChangeFilterTaskStatus(TASK_STATUS.DONE)}
        >
          <p
            className={`${
              filter === TASK_STATUS.DONE
                ? "underline decoration-purple-300 decoration-4"
                : ""
            }`}
          >
            {TASK_STATUS.DONE}
          </p>
        </button>
      </div>
    </div>
  );
};
