import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigators/RootNavigator';
import DropdownTypeProduct from '../components/DropdownTypeProduct';

type CreateProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateProduct'>;

const productTypes = [
  { label: 'Vàng', value: 'Vàng' },
  { label: 'Trang Sức', value: 'Trang Sức' },
  { label: 'Kim Cương', value: 'Kim Cương' },
];

const goldTypes = [
  { label: 'Vàng 18k', value: 'Vàng 18k' },
  { label: 'Vàng 24k', value: 'Vàng 24k' },
];

const diamondTypes = [
  { label: 'Kim Cương Type 1', value: 'Kim Cương Type 1' },
  { label: 'Kim Cương Type 2', value: 'Kim Cương Type 2' },
];

const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation<CreateProductScreenNavigationProp>();
  const [productType, setProductType] = useState('Vàng');
  const [goldType, setGoldType] = useState('');
  const [goldGram, setGoldGram] = useState('');
  const [diamondType, setDiamondType] = useState('');
  const [diamondGram, setDiamondGram] = useState('');
  const [carat, setCarat] = useState('');
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [cut, setCut] = useState('');
  const [jewelryType, setJewelryType] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    calculatePrice();
  }, [productType, goldType, goldGram, diamondType, diamondGram]);

  const calculatePrice = () => {
    let newPrice = 0;
    if (productType === 'Vàng') {
      newPrice = parseFloat(goldGram) * (goldType === 'Vàng 24k' ? 5000000 : 3000000);
    } else if (productType === 'Kim Cương') {
      newPrice = parseFloat(diamondGram) * 10000000; // Example price calculation
    } else if (productType === 'Trang Sức') {
      newPrice = (parseFloat(goldGram) * (goldType === 'Vàng 24k' ? 5000000 : 3000000)) + (parseFloat(diamondGram) * 10000000);
    }
    setPrice(newPrice);
  };

  const handleSaveProduct = async () => {
    const product = { id: Date.now().toString(), productType, goldType, goldGram, diamondType, diamondGram, carat, color, clarity, cut, jewelryType, price };
    const storedProducts = await AsyncStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    products.push(product);
    await AsyncStorage.setItem('products', JSON.stringify(products));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Sản Phẩm</Text>
      <DropdownTypeProduct
        data={productTypes}
        value={productType}
        onChange={(item) => setProductType(item.value)}
        placeholder="Chọn loại sản phẩm"
      />
      {productType === 'Vàng' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên trang sức"
            value={jewelryType}
            onChangeText={setJewelryType}
          />
          <DropdownTypeProduct
            data={goldTypes}
            value={goldType}
            onChange={(item) => setGoldType(item.value)}
            placeholder="Chọn loại vàng"
          />
          <TextInput
            style={styles.input}
            placeholder="Gram"
            value={goldGram}
            onChangeText={setGoldGram}
            keyboardType="numeric"
          />
          <Text style={styles.price}>Gía: {price.toLocaleString()} VND</Text>
        </View>
      )}
      {productType === 'Kim Cương' && (
        <View>
          <DropdownTypeProduct
            data={diamondTypes}
            value={diamondType}
            onChange={(item) => setDiamondType(item.value)}
            placeholder="Chọn loại kim cương"
          />
          <TextInput
            style={styles.input}
            placeholder="Gram kim cương"
            value={diamondGram}
            onChangeText={setDiamondGram}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập tên trang sức"
            value={jewelryType}
            onChangeText={setJewelryType}
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Carat"
            value={carat}
            onChangeText={setCarat}
            keyboardType="numeric"
          /> */}
          <TextInput
            style={styles.input}
            placeholder="Color"
            value={color}
            onChangeText={setColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Clarity"
            value={clarity}
            onChangeText={setClarity}
          />
          <TextInput
            style={styles.input}
            placeholder="Cut"
            value={cut}
            onChangeText={setCut}
          />
          <Text style={styles.price}>Gía: {price.toLocaleString()} VND</Text>
        </View>
      )}
      {productType === 'Trang Sức' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên trang sức"
            value={jewelryType}
            onChangeText={setJewelryType}
          />
          <DropdownTypeProduct
            data={goldTypes}
            value={goldType}
            onChange={(item) => setGoldType(item.value)}
            placeholder="Chọn loại vàng"
          />
          <TextInput
            style={styles.input}
            placeholder="Gram vàng"
            value={goldGram}
            onChangeText={setGoldGram}
            keyboardType="numeric"
          />
          <DropdownTypeProduct
            data={diamondTypes}
            value={diamondType}
            onChange={(item) => setDiamondType(item.value)}
            placeholder="Chọn loại kim cương"
          />
          <TextInput
            style={styles.input}
            placeholder="Gram kim cương"
            value={diamondGram}
            onChangeText={setDiamondGram}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Carat"
            value={carat}
            onChangeText={setCarat}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Color"
            value={color}
            onChangeText={setColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Clarity"
            value={clarity}
            onChangeText={setClarity}
          />
          <TextInput
            style={styles.input}
            placeholder="Cut"
            value={cut}
            onChangeText={setCut}
          />
          <Text style={styles.price}>
            Gía: {price.toLocaleString()} VND
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
        <Text style={styles.buttonText}>Tạo Sản Phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#FF6347',
  },
});

export default CreateProductScreen;
