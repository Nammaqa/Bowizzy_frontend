import axios from "../api";

export async function fetchCountries() {
  const res = await axios.get("/locations");
  return res.data;
}

export async function fetchStates(countryCode: string) {
  const res = await axios.get(`/locations?countryCode=${countryCode}`);
  return res.data;
}

export async function fetchCities(countryCode: string, stateCode: string) {
  const res = await axios.get(`/locations?countryCode=${countryCode}&stateCode=${stateCode}`);
  return res.data;
}
