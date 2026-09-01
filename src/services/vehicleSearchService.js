import axios from "axios";

const API_URL = "http://localhost:8082/api/vehicles/search";

export const searchVehicle = async (description, image) => {
  const formData = new FormData();

  if (description) {
    formData.append("description", description);
  }

  if (image) {
    formData.append("image", image);
  }

  const response = await axios.post(API_URL, formData);

  return response.data;
};