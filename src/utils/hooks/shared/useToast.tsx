import React, { useCallback, useRef, useState } from "react";

export const TOAST_TYPE = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  NONE: "NONE",
} as const;

type ToastType = keyof typeof TOAST_TYPE;

export type ToastValue = {
  text: string;
  type: ToastType;
};
type UseToast = [React.FC, (props: ToastValue) => void];

const TIMEOUT_MS = 3000;

/**
 * @example
 * const [ToastComponent, handleChangeToastState] = useToast();
 *
 * when success, handleChangeToastState({text, type: "SUCCESS"});
 *
 * return <ToastComponent>
 */
export const useToast = (): UseToast => {
  const [state, setState] = useState<ToastValue>({
    text: "",
    type: TOAST_TYPE.NONE,
  });
  const timerRef = useRef<NodeJS.Timeout>();

  const handleChangeComponent = useCallback((props: ToastValue) => {
    setState({ text: props.text, type: props.type });

    timerRef.current = setTimeout(() => {
      setState({ text: "", type: TOAST_TYPE.NONE });
    }, TIMEOUT_MS);
  }, []);

  const handleCloseComponent = useCallback(() => {
    setState({ text: "", type: TOAST_TYPE.NONE });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const Component: React.FC = () =>
    state.type === TOAST_TYPE.NONE ? (
      <></>
    ) : state.type === TOAST_TYPE.SUCCESS ? (
      <div
        id="toast-success"
        className="absolute top-0 mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="ml-3 text-sm font-normal">{state.text}</div>
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          data-dismiss-target="#toast-success"
          aria-label="Close"
          onClick={handleCloseComponent}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    ) : (
      <div
        id="toast-danger"
        className="absolute top-0 mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="ml-3 text-sm font-normal">{state.text}</div>
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          data-dismiss-target="#toast-danger"
          aria-label="Close"
          onClick={handleCloseComponent}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    );

  return [Component, handleChangeComponent];
};
