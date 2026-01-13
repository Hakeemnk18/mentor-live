import React from "react";

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type TableAction<T> = {
  label: string;
  onClick: (row: T) => void;
  variant?: "primary" | "danger";
};
