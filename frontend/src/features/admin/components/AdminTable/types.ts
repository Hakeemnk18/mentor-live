import React from "react";

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
};

export type TableAction<T> = {
  label: string;
  onClick: (row: T) => void;
  variant?: "primary" | "danger";
};
