import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("http://localhost:8080")) {
    config.url = config.url.replace("http://localhost:8080", API_BASE);
  }
  return config;
});

class apiCalls {
  saveUser(data) {
    return axios.post("http://localhost:8080/auth/register", data);
  }

  async saveBooking(data) {
    return await axios.post("http://localhost:8080/booking/add", data);
  }
  getBookingByUserId(profileId) {
    const res = axios.get("http://localhost:8080/booking/get/" + profileId);
    return res;
  }
  async getAllFlights() {
    return await axios.get("http://localhost:8080/flights/all");
  }
  async addFlight(data) {
    return await axios.post("http://localhost:8080/flights/add", data);
  }
  async deleteFlightById(data) {
    return await axios.delete("http://localhost:8080/flights/delete/" + data);
  }
  async updateFlightById(data) {
    return await axios.put("http://localhost:8080/flights/update", data);
  }

  async getSeatByFlightId(data) {
    return await axios.get("http://localhost:8080/seat/getseats/" + data);
  }

  async saveSeatType(data) {
    return await axios.post("http://localhost:8080/seat/add", data);
  }
  async updateSeatType(data) {
    return await axios.put("http://localhost:8080/seat/update", data);
  }
  async deleteSeatType(data) {
    return await axios.delete("http://localhost:8080/seat/delete/" + data);
  }
  async getAllUsers() {
    return await axios.get("http://localhost:8080/user/getallusers");
  }
  async addUser(data) {
    return await axios.post("http://localhost:8080/auth/register", data);
  }
  async updateUser(data) {
    return await axios.put("http://localhost:8080/user/update", data);
  }
  async deleteUser(data) {
    return await axios.delete("http://localhost:8080/user/delete/" + data);
  }
  async getAllBookings() {
    return await axios.get("http://localhost:8080/booking/get");
  }
  async deleteBooking(data) {
    return await axios.delete("http://localhost:8080/booking/delete/" + data);
  }
  async updateBooking(data) {
    return await axios.put("http://localhost:8080/booking/update", data);
  }
  async addBooking(data) {
    return await axios.post("http://localhost:8080/booking/add", data);
  }

  async getUserByUserId(data) {
    return await axios.get("http://localhost:8080/user/userbyid/" + data);
  }

  async getBookingsByUserId(data) {
    return await axios.get("http://localhost:8080/booking/get/" + data);
  }

  async getFlightbyFlightId(data) {
    return await axios.get("http://localhost:8080/flights/all/" + data);
  }
  async getSeatbySeatId(data) {
    return await axios.get("http://localhost:8080/seat/get/" + data);
  }
  async getBookingbyBookingId(data) {
    return await axios.get("http://localhost:8080/booking/getbooking/" + data);
  }
}
export default new apiCalls();
