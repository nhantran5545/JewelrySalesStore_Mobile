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
  material: string;
  materialId: string;
  productType: string;
  goldType?: string;
  goldGram?: string;
  gram: string;
  diamondGram?: string;
  diamondType?: string;
  jewelryType?: string;
  price: number;
  origin: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
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
    navigation.navigate('GuestCustomer');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>Loại: {item.productType}</Text>
            {item.material && (
              <Text style={styles.productName}>Loại Vàng: {item.material}</Text>
            )}
            <Text style={styles.productName}>Tên sản phẩm: {item.jewelryType}</Text>
            {item.gram && (
              <Text style={styles.productDetail}>Gram: {item.gram} gram</Text>
            )}
            {item.carat && (
              <Text style={styles.productDetail}>Carat: {item.carat} carat</Text>
            )}
            {item.origin && (
              <Text style={styles.productDetail}>Origin: {item.origin}</Text>
            )}
            {item.color && (
              <Text style={styles.productDetail}>Color: {item.color}</Text>
            )}
            {item.clarity && (
              <Text style={styles.productDetail}>Clarity: {item.clarity}</Text>
            )}
            {item.cut && (
              <Text style={styles.productDetail}>Cut: {item.cut}</Text>
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
    backgroundColor: '#F0F0F5',
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  productDetail: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347',
    marginTop: 8,
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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
