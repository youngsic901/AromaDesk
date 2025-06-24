import apiClient from "./index";

export const getProducts = async () => {
  try {
    const response = await apiClient.get("/api/products");
    return response.data;
  } catch (error) {
    console.error("상품 목록을 가져오는 데 실패했습니다.", error);
    throw error;
  }
};
