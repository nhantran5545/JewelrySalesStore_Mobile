import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cartBuyBack';

export const getCartBuyBack = async () => {
  try {
    const cart = await AsyncStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to get cart:', error);
    return [];
  }
};

export const addToCartBuyBack = async (product) => {
  try {
    const cart = await getCartBuyBack();
    const newCart = [...cart, product];
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};

export const removeFromCartBuyBack = async (productId) => {
  try {
    const cart = await getCartBuyBack();
    const updatedCart = cart.filter(item => item.productId !== productId);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
  }
};

export const clearCartBuyBack = async () => {
  try {
    await AsyncStorage.removeItem('cartBuyBack');
  } catch (error) {
    console.error('Failed to clear the cart from storage', error);
  }
};
