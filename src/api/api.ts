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

// Hàm gọi API để lấy danh sách Order
export const GetOrderList = async () => {
  try {
    const response = await api.get('/OrderSells/orderSellBySeller');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm gọi API tạo Khách hàng
export const createCustomer = async (customer: any) => {
  console.log(customer);
  try {
    const response = await api.post('/Customers/create', customer);
    return response.data;
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw error;
  }
};

//Hàm Call API lấy các loại Material
export const getMaterials = async () => {
  try {
    const response = await api.get('/Materials');
    return response.data;
  } catch (error) {
    console.error('Failed fetching materials:', error);
    throw error;
  }
};

// Hàm gọi API tính giá vật liệu
export const reviewMaterialPrice = async (materialId: number, weight: number) => {
  try {
    const response = await api.post('/OrderBuyBacks/review-material-price', {
      materialId,
      weight
    });
    return response.data;
  } catch (error) {
    // console.error('Failed to review material price:', error);
    throw error;
  }
};

// Hàm tinh API giá Kim Cương
export const reviewDiamondPrice = async (origin: string, caratWeight: number, color: string, clarity: string, cut: string) => {
  // console.log(origin, caratWeight, color, clarity, cut);
  try {
    const response = await api.post('/OrderBuyBacks/review-diamond-price', {
      origin,
      caratWeight,
      color,
      clarity,
      cut
    });
    return response.data;
  } catch (error) {
    // console.error('Failed to review diamond price:', error);
    throw error;
  }
};

//Hàm Call API lấy các category
export const getCategory = async () => {
  try {
    const response = await api.get('/CategoryTypes/category');
    return response.data;
  } catch (error) {
    console.error('Failed fetching category:', error);
    throw error;
  }
};

//Hàm tạo OrderBuyBackProductOut
export const createBuyBackInvoice = async (data: any) => {
  // console.log(data);


  try {
    const response = await api.post('/OrderBuyBacks/BuyBackProductOutOfStore', data);
    return response.data;
  } catch (error) {
    console.error('Error creating buyback invoice:', error);
    throw error;
  }
};

//Hàm gọi API để lấy Order Detail
export const GetOrderDetail = async (orderSellId: number) => {
  try {
    const response = await api.get(`/OrderSells/${orderSellId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order detail');
  }
};

//Hàm tính giá trả về của sản phẩm khi mua lại
export const calculateBuyBackPrice = async (productCode: string) => {
  try {
    const response = await api.get(`/OrderBuyBacks/CalculateBuyBackPrice/${productCode}`);
    return response.data;
  } catch (error) {
    console.error('Failed to calculate buyback price:', error);
    throw error;
  }
};

//Hàm gọi API để lấy tất cả Order Detail
export const GetAllOrderList = async () => {
  try {
    const response = await api.get('/OrderSells');
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Hàm tạo OrderBuyBackProductInStore
export const createOrderBuyBackStore = async (data: any) => {
  console.log(data);
  try {
    const response = await api.post('/OrderBuyBacks/BuyBackProductInStore', data);
    return response.data;
  } catch (error) {
    console.error('Error creating buyback order store:', error);
    throw error;
  }
};

// Function to deliver an order
export const deliverOrder = async (orderSellId: number) => {
  try {
    const response = await api.put(`/OrderSells/deliveried?orderSellId=${orderSellId}`);
    return response.data;
  } catch (error) {
    console.error('Error delivering order:', error);
    throw error;
  }
};

// Function to deliver an order
export const cancelOrder = async (orderSellId: number) => {
  try {
    const response = await api.put(`/OrderSells/cancel?orderSellId=${orderSellId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancel order:', error);
    throw error;
  }
};


// New function to get Processing orders
export const GetProcessingOrderList = async () => {
  try {
    const response = await api.get('/OrderSells/orderSellProcessingBySeller');
    return response.data;
  } catch (error) {
    console.error('Error order Processing:', error);
    throw error;
  }
};

export default api;

