import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigators/RootNavigator';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Define Product type
type Product = {
  id: string;
  productType: string;
  goldType?: string;
  goldGram?: string;
  diamondGram?: string;
  diamondType?: string;
  jewelryType?: string;
  price: number;
};

type ProductListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const storedProducts = await AsyncStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
            <Feather name="plus" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearProducts} style={styles.clearButton}>
            <Feather name="trash-2" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleAddProduct = () => {
    navigation.navigate('CreateProduct');
  };

  const handleClearProducts = async () => {
    await AsyncStorage.removeItem('products');
    setProducts([]);
  };

  const handleNext = () => {
    // alert('Chức năng chưa được thực hiện');
    navigation.navigate('CreateInvoiceBuyBack');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>Loại: {item.productType}</Text>
            <Text style={styles.productName}>Tên sản phẩm: {item.jewelryType}</Text>
            {item.goldType && (
              <Text style={styles.productPrice}>Loại Vàng: {item.goldType}</Text>
            )}
            {item.goldGram && (
              <Text style={styles.productPrice}>Gold Gram: {item.goldGram ? `${item.goldGram} gram` : ''}</Text>

            )}
            {item.diamondType && (
              <Text style={styles.productPrice}>Loại Kim Cương: {item.diamondType}</Text>
            )}
            {item.diamondGram && (
              <Text style={styles.productPrice}>Diamond Gram: {item.diamondGram ? `${item.diamondGram} gram` : ''}</Text>
            )}
            <Text style={styles.productPrice}>Giá: {item.price.toLocaleString()} VND</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Bước Tiếp Theo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888888',
  },
  listContainer: {
    paddingBottom: 100,
  },
  nextButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginLeft: 16,
  },
  addButton: {
    marginRight: 16,
  },
  clearButton: {
    marginRight: 16,
  },
});

export default ProductListScreen;
