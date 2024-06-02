import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart';

export const getCart = async () => {
  try {
    const cart = await AsyncStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to get cart:', error);
    return [];
  }
};

export const addToCart = async (product) => {
  try {
    const cart = await getCart();
    const newCart = [...cart, product];
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};

export const removeFromCart = async (productId) => {
  try {
    const cart = await getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
  }
};
