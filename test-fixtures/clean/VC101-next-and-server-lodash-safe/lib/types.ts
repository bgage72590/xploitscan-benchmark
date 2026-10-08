import { DebouncedFunc } from "lodash";

export type Customer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type SearchHandler = DebouncedFunc<(query: string) => void>;
