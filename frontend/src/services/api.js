import axios from "axios";

const API = axios.create({ baseURL: "https://vehicle-detector-new.onrender.com/api/vehicles" });

export const fetchVehicles = () => API.get("/");
export const createEntry = (vehicleNo) => API.post("/entry", { vehicleNo });
export const markExit = (id) => API.put(`/exit/${id}`);
