/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AxiosInstance } from "axios";

import axiosConfig from "../config/axiosConfig";

const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <AxiosContext.Provider value={axiosConfig}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => {
  const ctx = useContext(AxiosContext);

  if (!ctx) {
    throw new Error("useAxios must be used within AxiosProvider");
  }

  return ctx;
};