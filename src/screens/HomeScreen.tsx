import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import MasonryList from "reanimated-masonry-list";
import { BlurView } from "expo-blur";
import { TabsStackScreenProps } from "../navigators/TabsNavigator";
import SearchBar from "../components/SearchBar";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import axios from "axios";
import { addToCart } from "../utils/cartUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCategory } from "../api/api";
import SearchCustomer from "../components/SearchCustomer";
import SearchProduct from "../components/SearchProduct";

const AVATAR_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzwyqpjAmQf9cJZJYedogG6ivGM_FAyiIOwQ&s";

const cardData = [
  {
    id: "luxury",
    imageUrl: "https://bizweb.dktcdn.net/100/202/714/products/3-9ffb16da-fd33-4782-8d07-b10d6d0485a0.jpg?v=1509958128110",
    title: "Sang Trọng"
  },
  {
    id: "sparkling",
    imageUrl: "https://img.lovepik.com/photo/40038/7995.jpg_wh860.jpg",
    title: "Lấp Lánh"
  },
  {
    id: "elegant",
    imageUrl: "https://eropi.com/media/wysiwyg/bo_trang_suc/bo-trang-suc-bac-nice-flower-pearl_2_.JPG",
    title: "Quý Phái"
  },
];

type Category = {
  categoryId: number;
  categoryName: string;
};

type Product = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  quantity: number;
};

const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const { colors } = useTheme();
  const [categories, setCategories] = useState<Category[]>([{ categoryId: 0, categoryName: 'All' }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [account, setAccount] = useState<{ firstName: string; lastName: string } | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const handleAddToCart = async (product: any) => {
    const success = await addToCart(product);
    if (success) {
      Alert.alert('Thêm vào giỏ hàng', `Sản phẩm đã được thêm vào giỏ hàng.`);
    } else {
      Alert.alert('Sản phẩm đã tồn tại', 'Sản phẩm này đã có trong giỏ hàng.');
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const accountData = await AsyncStorage.getItem('account');
        if (accountData) {
          const parsedAccount = JSON.parse(accountData);
          setAccount(parsedAccount);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };

    fetchAccount();
  }, []);

  const renderGreeting = () => {
    if (account) {
      return (
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          style={{
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Image
            source={{
              uri: AVATAR_URL,
            }}
            style={{ width: 52, aspectRatio: 1, borderRadius: 52 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 8,
                color: colors.text,
              }}
              numberOfLines={1}
            >
              {`Hello, ${account.lastName}`} 👋
            </Text>
            <Text
              style={{ color: colors.text, opacity: 0.75 }}
              numberOfLines={1}
            >
              Khám phá trang các trang sức phù hợp
            </Text>
          </View>
          {/* <TouchableOpacity
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 52,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Icons name="notifications" size={24} color={colors.text} />
          </TouchableOpacity> */}
        </Animated.View>
      );
    }
    return null; // Return null if account is not yet fetched or is null
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // console.log(token);
      if (!token) {
        console.error('No token found');
        return;
      }

      // Fetch categories
      const categoryResponse = await getCategory();
      setCategories([{ categoryId: 0, categoryName: 'All' }, ...categoryResponse]);

      // Gọi API để lấy danh sách sản phẩm
      const productResponse = await axios.get('https://jssatsapi20240629152002.azurewebsites.net/api/Products/allProductsAvaiable', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedProducts = productResponse.data.map((product: any) => ({
        productId: product.productId,
        name: product.productName,
        price: product.productPrice,
        imageUrl: product.img,
        categoryId: product.categoryId,
        quantity: product.quantity,
      }));
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );


  const handleSearch = (query: string) => {
    const filtered = products.filter((product) =>
      product.productId.toLowerCase().includes(query.toLowerCase()) 
    );
    setFilteredProducts(filtered);
  };

  const handleCategorySelect = (index: number) => {
    setCategoryIndex(index);
    if (index === 0) {
      setFilteredProducts(products);
    } else {
      const selectedCategoryId = categories[index].categoryId;
      const filtered = products.filter(product => product.categoryId === selectedCategoryId);
      setFilteredProducts(filtered);
    }
  };

  const handleSeeAll = () => {
    setFilteredProducts(products);
    setCategoryIndex(0); 
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ paddingVertical: 24, gap: 24 }}>
        {/* Header Section */}
        {renderGreeting()}
        {/* Search Section */}
        {/* <SearchCustomer onSearch={handleSearch} /> */}
        <SearchProduct onSearch={handleSearch}/>
        {/* Grid Jewelries View */}
        <View style={{ paddingHorizontal: 3 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginLeft: 20 }}
            >
              Đồ trang sức mới
            </Text>
            <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 10, padding: 10, marginRight: 10}} onPress={() => handleSeeAll() }>
              <Text style={{ color: 'white'}}>See All</Text>
            </TouchableOpacity>
          </View>
         {/* Card Section */}
         <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ height: 200 }}
          >
            <Animated.View
              entering={FadeInRight.delay(600).duration(1000).springify()}
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              {cardData.map((card) => (
                <View key={card.id} style={{ width: 300 }}>
                  <Card
                    onPress={() =>
                      navigation.navigate("Details", { id: card.id })
                    }
                    imageUrl={card.imageUrl}
                    title={card.title}
                  />
                </View>
              ))}
            </Animated.View>
          </ScrollView>
        </View>

        {/* Categories Section */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
          }}
          renderItem={({ item, index }) => {
            const isSelected = categoryIndex === index;
            return (
              <Animated.View
                entering={FadeInUp.delay(600).duration(1000).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleCategorySelect(index)}
                  style={{
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 100,
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? colors.background : colors.text,
                      fontWeight: "600",
                      fontSize: 14,
                      opacity: isSelected ? 1 : 0.5,
                    }}
                  >
                    {item.categoryName}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          keyExtractor={(item) => item.categoryId.toString()}
        />

        {/* Mesonary */}
        <MasonryList
          data={filteredProducts}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }: any) => (
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
              style={{ padding: 6 }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Details", { id: item.productId })}>
                <View
                  style={{
                    aspectRatio: i === 0 ? 2/3 : 2 / 3,
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 24,
                  }}
                >
                  <Image
                    source={{
                      uri: item.imageUrl,
                    }}
                    resizeMode="cover"
                    style={StyleSheet.absoluteFill}
                  />
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        padding: 12,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: "row", gap: 8, padding: 4 }}>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#000000",
                          textShadowColor: "rgba(0,0,0,0.2)",
                          textShadowOffset: {
                            height: 1,
                            width: 0,
                          },
                          textShadowRadius: 4,
                        }}
                      >
                        {item.name}
                      </Text>
                      {/* <Text
                        style={{
                          flex: 1,
                          fontSize: 10,
                          fontWeight: "600",
                          color: "#000000",
                          textShadowColor: "rgba(0,0,0,0.2)",
                          textShadowOffset: {
                            height: 1,
                            width: 0,
                          },
                          textShadowRadius: 4,
                        }}
                      >
                        {item.productId}
                      </Text> */}
                    </View>
                    <View style={{ flexDirection: "row", gap: 8, padding: 4 }}>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 10,
                          fontWeight: "600",
                          color: "#000000",
                          textShadowColor: "rgba(0,0,0,0.2)",
                          textShadowOffset: {
                            height: 1,
                            width: 0,
                          },
                          textShadowRadius: 4,
                        }}
                      >
                        {item.productId}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <BlurView
                      style={{
                        flexDirection: "row",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        alignItems: "center",
                        padding: 6,
                        borderRadius: 100,
                        overflow: "hidden",
                      }}
                      intensity={20}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#000000",
                          marginLeft: 0,
                        }}
                        numberOfLines={2}
                      >
                        {item.price.toLocaleString()} VND
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleAddToCart(item)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 100,
                          backgroundColor: "#fff",
                        }}
                      >
                        <Icons name="add-shopping-cart" size={18} color="#000" />
                      </TouchableOpacity>
                    </BlurView>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

// const Card = ({
//   price,
//   imageUrl,
//   name,
//   onPress,
// }: {
//   price: number;
//   imageUrl: string;
//   name: string;
//   onPress?: () => void;
// }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         flex: 1,
//         position: "relative",
//         overflow: "hidden",
//         borderRadius: 24,
//       }}
//     >
//       <Image
//         source={{
//           uri: imageUrl,
//         }}
//         resizeMode="cover"
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 0,
//         }}
//       />
//       <View
//         style={{
//           position: "absolute",
//           left: 12,
//           top: 12,
//           paddingHorizontal: 12,
//           paddingVertical: 8,
//           backgroundColor: "rgba(0,0,0,0.25)",
//           borderRadius: 100,
//         }}
//       >
//         <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
//           {name}
//         </Text>
//         <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff", marginTop: 120 }}>
//           {price} VND
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

const Card = ({
  imageUrl,
  title,
  onPress,
}: {
  imageUrl: string;
  title: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
      }}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        resizeMode="cover"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: "rgba(0,0,0,0.25)",
          borderRadius: 100,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
