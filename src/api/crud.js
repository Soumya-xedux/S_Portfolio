import { api } from "./client";

export const getSection = (section) =>
  api.get(`/${section}`).then(res => res.data);

export const createItem = (section, data) =>
  api.post(`/${section}`, data);

export const updateItem = (section, id, data) =>
  api.put(`/${section}/${id}`, data);

export const deleteItem = (section, id) =>
  api.delete(`/${section}/${id}`);