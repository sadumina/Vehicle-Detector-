import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api/vehicles" });

export const fetchVehicles = () => API.get("/");
export const createEntry = (vehicleNo) => API.post("/entry", { vehicleNo });
export const markExit = (id) => API.put(`/exit/${id}`);
