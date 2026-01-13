export type PageAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
};
