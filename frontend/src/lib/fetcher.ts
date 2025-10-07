import axios from "axios";

export const fetcher = <T>(url: string) =>
  axios.get<T>(`api/${url}`).then((res) => res.data);
