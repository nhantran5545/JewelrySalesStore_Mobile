import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
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

const CATEGORIES = [
  "Ring",
  "Necklace",
  "Pendant",
  "Earring",
  "Shake",
  "Ring",
  "Charm",
  "Neck Strap",
  "Stirrups",
];

const AVATAR_URL =
  "https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-6/397531770_1051616996022156_3370330046834720504_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFMgvmDcTnhB5nozzUYqFv2AsodDh6apGcCyh0OHpqkZ5rSl-UPHnmjOQXyYyo-UWUvJ8_DdTvhH8b-LrF4mnde&_nc_ohc=E94nY0B2DjAQ7kNvgGnx0Ph&_nc_pt=1&_nc_ht=scontent.fhan3-4.fna&oh=00_AYBHugshxYM2-DEVYGfArotHK34E6HorRZe2dViseiriug&oe=664BE649";

const PRODUCT_LIST_DATA = [
  {
    imageUrl:
      "https://wowjewelry.com.vn/wp-content/uploads/2022/10/O-Nhan-Kim-Cuong-Dai-Hoa-WOW3-scaled-1-scaled.jpg",
    title: "WOW Diamond Jewelry",
    price: 1600,
  },
  {
    imageUrl:
      "https://wowjewelry.com.vn/wp-content/uploads/2022/10/O-Nhan-Kim-Cuong-Dai-Hoa-WOW3-scaled-1-scaled.jpg",
    title: "WOW Diamond Jewelry",
    price: 1560,
  },
  {
    imageUrl:
      "https://wowjewelry.com.vn/wp-content/uploads/2022/10/O-Nhan-Kim-Cuong-Dai-Hoa-WOW3-scaled-1-scaled.jpg",
    title: "WOW Diamond Jewelry",
    price: 2340,
  },
  {
    imageUrl:
      "https://wowjewelry.com.vn/wp-content/uploads/2022/10/O-Nhan-Kim-Cuong-Dai-Hoa-WOW3-scaled-1-scaled.jpg",
    title: "WOW Diamond Jewelry",
    price: 13460,
  },
  {
    imageUrl:
      "https://wowjewelry.com.vn/wp-content/uploads/2022/10/O-Nhan-Kim-Cuong-Dai-Hoa-WOW3-scaled-1-scaled.jpg",
    title: "WOW Diamond Jewelry",
    price: 12340,
  },
];

const cardData = [
  {
    id: "123",
    price: 13050,
    imageUrl: "https://sinhdien.com.vn/public/thumbs/IMG_0022.jpg",
  },
  {
    id: "456",
    price: 12020,
    imageUrl: "https://sinhdien.com.vn/public/thumbs/IMG_0022.jpg",
  },
  {
    id: "789",
    price: 17000,
    imageUrl: "https://sinhdien.com.vn/public/thumbs/IMG_0022.jpg",
  },
];

type Category = {
  id: number;
  name: string;
};

const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const { colors } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    // Gọi API để lấy danh sách danh mục
    axios.get<Category[]>('http://192.168.114.179:3000/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={{ paddingVertical: 24, gap: 24 }}>
        {/* Header Section */}
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
              Hi, Nhan 👋
            </Text>
            <Text
              style={{ color: colors.text, opacity: 0.75 }}
              numberOfLines={1}
            >
              Discover Jewelry that suit your favorite
            </Text>
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>
        </Animated.View>
        {/* Search Section */}
        <SearchBar />
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
              style={{ fontSize: 20, fontWeight: "700", color: colors.text }}
            >
              New Jewelries
            </Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary }}>See All</Text>
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
              {cardData.map((card, index) => (
                <View key={card.id} style={{ width: 300 }}>
                  <Card
                    onPress={() =>
                      navigation.navigate("Details", { id: card.id })
                    }
                    price={card.price}
                    imageUrl={card.imageUrl}
                  />
                </View>
              ))}
            </Animated.View>
          </ScrollView>
        </View>

        {/* Categories Section */}
        {/* <FlatList
          data={CATEGORIES}
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
                  onPress={() => setCategoryIndex(index)}
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
                    {item}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        /> */}

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
                  onPress={() => setCategoryIndex(index)}
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
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Mesonary */}
        <MasonryList
          data={PRODUCT_LIST_DATA}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }: any) => (
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
              style={{ padding: 6 }}
            >
              <View
                style={{
                  aspectRatio: i === 0 ? 1 : 2 / 3,
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
                        color: "#fff",
                        textShadowColor: "rgba(0,0,0,0.2)",
                        textShadowOffset: {
                          height: 1,
                          width: 0,
                        },
                        textShadowRadius: 4,
                      }}
                    >
                      {item.title}
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
                        color: "#fff",
                        marginLeft: 8,
                      }}
                      numberOfLines={1}
                    >
                      ${item.price}
                    </Text>
                    <TouchableOpacity
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
            </Animated.View>
          )}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const Card = ({
  price,
  imageUrl,
  onPress,
}: {
  price: number;
  imageUrl: string;
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
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
          ${price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
