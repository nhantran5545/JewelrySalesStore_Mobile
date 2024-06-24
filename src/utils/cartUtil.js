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
    const isDuplicate = cart.some(item => item.productId === product.productId);

    if (isDuplicate) {
      return false; 
    }

    const newCart = [...cart, product];
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
    return true; // Indicate that the product was added successfully
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return false; // Indicate that there was an error adding the product
  }
};

export const removeFromCart = async (productId) => {
  try {
    const cart = await getCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem('cart');
  } catch (error) {
    console.error('Failed to clear the cart from storage', error);
  }
};
