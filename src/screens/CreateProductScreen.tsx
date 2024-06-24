import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigators/RootNavigator';
import DropdownTypeProduct from '../components/DropdownTypeProduct';
import { getMaterials, reviewMaterialPrice, reviewDiamondPrice } from '../api/api';
import { ScrollView } from 'react-native-gesture-handler';

type CreateProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateProduct'>;

const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation<CreateProductScreenNavigationProp>();
  const [productType, setProductType] = useState('Vàng');
  const [material, setMaterial] = useState('');
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [gram, setGram] = useState('');
  const [chiVang, setChiVang] = useState('');
  const [carat, setCarat] = useState('');
  const [origin, setOrigin] = useState('');
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [cut, setCut] = useState('');
  const [jewelryType, setJewelryType] = useState('');
  const [goldTypeName, setGoldTypeName] = useState('');
  const [price, setPrice] = useState(0);
  const [goldPrice, setGoldPrice] = useState(0);
  const [diamondPrice, setDiamondPrice] = useState(0);
  const [materials, setMaterials] = useState<{ label: string; value: string; materialId: number }[]>([]);
  const [inputType, setInputType] = useState<'gram' | 'chiVang'>('gram');

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    setGoldPrice(0);
    setDiamondPrice(0);
    if (productType === 'Vàng' || productType === 'Bạc' || productType === 'Trang Sức') {
      if ((material && gram) || chiVang) {
        calculateGoldPrice();
      }
    }
    if (productType === 'Kim Cương' || productType === 'Trang Sức') {
      if (carat && color && clarity && cut && origin) {
        calculateDiamondPrice();
      }
    }
  }, [productType, material, gram, chiVang, carat, color, clarity, cut]);

  useEffect(() => {
    setPrice(goldPrice + diamondPrice);
  }, [goldPrice, diamondPrice]);

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials();
      const formattedMaterials = data.flatMap((materialType: any) => {
        return materialType.materials.map((material: any) => ({
          label: material.materialName,
          value: material.materialName,
          materialId: material.materialId
        }));
      });
      setMaterials(formattedMaterials);
    } catch (error) {
      Alert.alert('Error fetching materials', 'Please try again later.');
    }
  };

  const calculateGoldPrice = async () => {
    try {
      const selectedMaterial = materials.find((item) => item.label === material);
      if (selectedMaterial) {
        const weight = inputType === 'gram' ? parseFloat(gram) : parseFloat(chiVang) * 3.75;
        const response = await reviewMaterialPrice(selectedMaterial.materialId, weight);
        if (response.success) {
          setGoldPrice(response.price);
        }
      }
    } catch (error) {
      // Alert.alert('Error calculating price', 'Please try again later.');
    }
  };

  const calculateDiamondPrice = async () => {
    try {
      const weight = parseFloat(carat);
      const response = await reviewDiamondPrice(origin, weight, color, clarity, cut);
      if (response.success) {
        setDiamondPrice(response.price);
      }
    } catch (error) {
      Alert.alert('Error calculating diamond price', 'Please try again later.');
    }
  };

  const handleSaveProduct = async () => {
    const product = {
      id: Date.now().toString(),
      productType,
      origin,
      material,
      materialId,
      gram,
      chiVang,
      carat,
      color,
      clarity,
      cut,
      jewelryType,
      price,
    };

    const storedProducts = await AsyncStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    products.push(product);
    await AsyncStorage.setItem('products', JSON.stringify(products));
    navigation.goBack();
  };

  const handleProductTypeChange = (type: string) => {
    setProductType(type);
    setGoldPrice(0);
    setDiamondPrice(0);
    setPrice(0);
  };

  const handleInputTypeChange = (type: 'gram' | 'chiVang') => {
    setInputType(type);
    setGoldPrice(0);
  };

  const productTypes = [
    { label: 'Vàng', value: 'Vàng' },
    { label: 'Bạc', value: 'Bạc' },
    { label: 'Trang Sức', value: 'Trang Sức' },
    { label: 'Kim Cương', value: 'Kim Cương' },
  ];

  const originOptions = [
    { label: 'Natural', value: 'Natural' },
    { label: 'Artificial', value: 'Artificial' }
  ];

  const colorOptions = [
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
    { label: 'F', value: 'F' },
    { label: 'J', value: 'J' },
  ];

  const clarityOptions = [
    { label: 'IF', value: 'IF' },
    { label: 'VVS1', value: 'VVS1' },
    { label: 'VVS2', value: 'VVS2' },
    { label: 'VS1', value: 'VS1' },
    { label: 'VS2', value: 'VS2' },
  ];

  const cutOptions = [
    { label: 'Excellent', value: 'Excellent' },
    { label: 'Very Good', value: 'Very Good' },
    { label: 'Good', value: 'Good' },
  ];

  const caratOptions = Array.from({ length: 21 }, (_, i) => (0.1 + i * 0.01).toFixed(2)).map(value => ({
    label: value,
    value,
  }));

  const validateCaratInput = (value: string) => {
    const regex = /^(\d{1,2})(\.\d{0,2})?$/;
    if (regex.test(value) && parseFloat(value) <= 10) {
      setCarat(value);
    }
  };

  return (

    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Tạo Sản Phẩm</Text>
        <DropdownTypeProduct
          data={productTypes}
          value={productType}
          onChange={(item) => handleProductTypeChange(item.value)}
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
              data={materials.filter((item) => item.label.includes('Vàng'))}
              value={material}
              onChange={(item) => {
                setMaterial(item.value);
                // setGoldTypeName(item.value);
                setJewelryType(item.value);
                const selectedMaterial = materials.find((mat) => mat.label === item.value);
                if (selectedMaterial) {
                  setMaterialId(selectedMaterial.materialId);
                }
              }}
              placeholder="Chọn loại vàng"
            />
            <View style={styles.switchContainer}>
              <TouchableOpacity onPress={() => handleInputTypeChange('gram')}>
                <Text style={inputType === 'gram' ? styles.selected : styles.notSelected}>Gram</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleInputTypeChange('chiVang')}>
                <Text style={inputType === 'chiVang' ? styles.selected : styles.notSelected}>Số chỉ vàng</Text>
              </TouchableOpacity>
            </View>
            {inputType === 'gram' ? (
              <TextInput
                style={styles.input}
                placeholder="Gram"
                value={gram}
                onChangeText={setGram}
                keyboardType="numeric"
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Số chỉ vàng"
                value={chiVang}
                onChangeText={setChiVang}
                keyboardType="numeric"
              />
            )}
            <Text style={styles.price}>Giá: {price.toLocaleString()} VND</Text>
          </View>
        )}
        {productType === 'Bạc' && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên trang sức"
              value={jewelryType}
              onChangeText={setJewelryType}
            />
            <DropdownTypeProduct
              data={materials.filter((item) => item.label.includes('Bạc'))}
              value={material}
              onChange={(item) => {
                setMaterial(item.value);
                // setGoldTypeName(item.value);
                setJewelryType(item.value);
                const selectedMaterial = materials.find((mat) => mat.label === item.value);
                if (selectedMaterial) {
                  setMaterialId(selectedMaterial.materialId);
                }
              }}
              placeholder="Chọn loại bạc"
            />
            <TextInput
              style={styles.input}
              placeholder="Gram"
              value={gram}
              onChangeText={setGram}
              keyboardType="numeric"
            />
            <Text style={styles.price}>Giá: {price.toLocaleString()} VND</Text>
          </View>
        )}
        {productType === 'Kim Cương' && (
          <View>
            {/* <TextInput
            style={styles.input}
            placeholder="Nhập tên trang sức"
            value={jewelryType}
            onChangeText={setJewelryType}
          /> */}
            <DropdownTypeProduct
              data={originOptions}
              value={origin}
              onChange={(item) => setOrigin(item.value)}
              placeholder="Chọn Origin"
            />
            {/* <DropdownTypeProduct
              data={caratOptions}
              value={carat}
              onChange={(item) => setCarat(item.value)}
              placeholder="Chọn Carat"
            /> */}
            <TextInput
              style={styles.input}
              placeholder="Carat"
              value={carat}
              onChangeText={validateCaratInput}
              keyboardType="numeric"
            />
            <DropdownTypeProduct
              data={colorOptions}
              value={color}
              onChange={(item) => setColor(item.value)}
              placeholder="Chọn Color"
            />
            <DropdownTypeProduct
              data={clarityOptions}
              value={clarity}
              onChange={(item) => setClarity(item.value)}
              placeholder="Chọn Clarity"
            />
            <DropdownTypeProduct
              data={cutOptions}
              value={cut}
              onChange={(item) => setCut(item.value)}
              placeholder="Chọn Cut"
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
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Vàng</Text>
            <DropdownTypeProduct
              data={materials.filter((item) => item.label.includes('Vàng'))}
              value={material}
              onChange={(item) => {
                setMaterial(item.value);
                // setGoldTypeName(item.value);
                // setJewelryType(item.value);
                const selectedMaterial = materials.find((mat) => mat.label === item.value);
                if (selectedMaterial) {
                  setMaterialId(selectedMaterial.materialId);
                }
              }}
              placeholder="Chọn loại vàng"
            />

            <View style={styles.switchContainer}>
              <TouchableOpacity onPress={() => handleInputTypeChange('gram')}>
                <Text style={inputType === 'gram' ? styles.selected : styles.notSelected}>Gram</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleInputTypeChange('chiVang')}>
                <Text style={inputType === 'chiVang' ? styles.selected : styles.notSelected}>Số chỉ vàng</Text>
              </TouchableOpacity>
            </View>
            {inputType === 'gram' ? (
              <TextInput
                style={styles.input}
                placeholder="Gram"
                value={gram}
                onChangeText={setGram}
                keyboardType="numeric"
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Số chỉ vàng"
                value={chiVang}
                onChangeText={setChiVang}
                keyboardType="numeric"
              />
            )}
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Kim Cương</Text>
            <DropdownTypeProduct
              data={originOptions}
              value={origin}
              onChange={(item) => setOrigin(item.value)}
              placeholder="Chọn Origin"
            />
            <TextInput
              style={styles.input}
              placeholder="Carat"
              value={carat}
              onChangeText={validateCaratInput}
              keyboardType="numeric"
            />
            <DropdownTypeProduct
              data={colorOptions}
              value={color}
              onChange={(item) => setColor(item.value)}
              placeholder="Chọn Color"
            />
            <DropdownTypeProduct
              data={clarityOptions}
              value={clarity}
              onChange={(item) => setClarity(item.value)}
              placeholder="Chọn Clarity"
            />
            <DropdownTypeProduct
              data={cutOptions}
              value={cut}
              onChange={(item) => setCut(item.value)}
              placeholder="Chọn Cut"
            />
            <Text style={styles.price}>
              Giá: {price.toLocaleString()} VND
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
          <Text style={styles.buttonText}>Tạo Sản Phẩm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    //  <KeyboardAvoidingView
    //  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //  // style={{ flex: 1 }}
    // >
    //     </KeyboardAvoidingView>
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
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  selected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
    marginHorizontal: 16,
  },
  notSelected: {
    fontSize: 16,
    color: '#000000',
    marginHorizontal: 16,
  },
});

export default CreateProductScreen;
