import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { Ionicons } from '@expo/vector-icons';
import Icons from "@expo/vector-icons/MaterialIcons";
import { CompositeScreenProps } from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import { RootStackScreenProps } from "./RootNavigator";
import CustomBottomTabs from "../components/CustomBottomTabs";
import CartScreen from "../screens/CartScreen";
import { FontAwesome5 } from '@expo/vector-icons';
import BuyBackScreen from "../screens/BuyBackScreen";
import Menu from "../screens/MenuScreen";

export type TabsStackParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
  BuyBack: undefined;
  Menu: undefined;
};
const TabsStack = createBottomTabNavigator<TabsStackParamList>();

export type TabsStackScreenProps<T extends keyof TabsStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabsStackParamList, T>,
    RootStackScreenProps<"TabsStack">
  >;

const TabsNavigator = () => {
  return (
    <TabsStack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: 'center'
      }}
      tabBar={(props) => <CustomBottomTabs {...props} />}
    >
      <TabsStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return <Icons name="home" {...props} />;
          },
        }}
      />
      <TabsStack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: true,
          title: 'Giỏ Hàng' ,
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: '700'
          },
          // headerLeft: () => (
          //   <TouchableOpacity style={{marginLeft: 15}} >
          //     <Ionicons name="chevron-back-outline" size={27} color="black" />
          //   </TouchableOpacity>
          // ),
          tabBarIcon(props) {
            return <Icons name="shopping-cart" {...props} />;
          },
        }}
      />
      <TabsStack.Screen
        name="BuyBack"
        component={BuyBackScreen}
        options={{
          headerShown: true,
          title: 'Mua lại' ,
          tabBarIcon(props) {
            return <Icons name="store" {...props} />;
          },
        }}
      />
      <TabsStack.Screen
        name="Menu"
        component={Menu}
        options={{
          headerShown: true,
          title: 'Menu',
          tabBarIcon(props) {
            return <Icons name="menu" {...props} />;
          },
        }}
      />
    </TabsStack.Navigator>
  );
};

export default TabsNavigator;

const Example = () => {
  return <View />;
};
