import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance của axios
const api = axios.create({
  baseURL: 'https://bfrsserver.azurewebsites.net/api',
});

// Thêm interceptor để tự động đính kèm token vào headers
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Hàm gọi API lấy danh sách khách hàng
export const fetchCustomers = async () => {
  try {
    const response = await api.get('/Customers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm gọi API lấy danh sách khách hàng
export const fetchProductById = async (productId: string) => {
  try {
    const response = await api.get(`/Products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    throw error;
  }
};

// Hàm gọi API tạo hóa đơn
export const createInvoice = async (invoiceData: any) => {
  console.log(invoiceData);
  try {
    const response = await api.post('/OrderSells/create', invoiceData);
    return response.data;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw error;
  }
};


export default api;
