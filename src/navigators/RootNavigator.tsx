import React from "react";
import { NavigatorScreenParams } from "@react-navigation/native";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import DetailsScreen from "../screens/DetailsScreen";
import TabsNavigator, { TabsStackParamList } from "./TabsNavigator";
import CustomerInfoScreen from "../screens/CustomerInfoScreen";
import CustomerListScreen from "../screens/CustomerListScreen";
import AddCustomerScreen from "../screens/AddCustomerScreen";
import CreateInvoiceScreen from "../screens/CreateInvoiceScreen";
import GuestCustomerScreen from "../screens/GuestCustomerScreen";
import ProductListScreen from "../screens/ProductListScreen";
import CreateProductScreen from "../screens/CreateProductScreen";
import CreateInvoiceBuyBackScreen from "../screens/CreateInvoiceBuyBackScreen";

type Customer = {
  customerId: string;
  tierId: number;
  tierName: string;
  name: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  discountPercent: number;
};

export type RootStackParamList = {
  TabsStack: NavigatorScreenParams<TabsStackParamList>;
  Details: {
    id: string;
  };
  Cart: undefined;
  CustomerInfo1: undefined;
  CustomerInfo: { customer: Customer }
  CustomerList: undefined;
  AddCustomer: undefined;
  CreateInvoice: { customer: Customer };
  BuyBack: undefined;
  GuestCustomer: undefined;
  ProductList: undefined;
  CreateProduct: undefined;
  CreateInvoiceBuyBack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="TabsStack"
        component={TabsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="CustomerInfo"
        component={CustomerInfoScreen}
        options={{
          headerShown: true,
          title: 'Thông Tin Khách Hàng',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="CustomerInfo1"
        component={CustomerInfoScreen}
        options={{
          headerShown: true,
          title: 'Thông Tin Khách Hàng',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="CustomerList"
        component={CustomerListScreen} 
        options={{
          headerShown: true,
          title: 'Danh Sách Khách Hàng',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="AddCustomer"
        component={AddCustomerScreen} 
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="CreateInvoice"
        component={CreateInvoiceScreen} 
        options={{
          headerShown: true,
          title: 'Tạo Hóa Đơn',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="GuestCustomer"
        component={GuestCustomerScreen}
        options={{
          headerShown: true,
          title: 'Thông Tin Khách Hàng',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          headerShown: true,
          title: 'Danh Sách Sản Phẩm',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="CreateProduct"
        component={CreateProductScreen} 
        options={{
          headerShown: true,
          title: 'Thông Tin Sản Phẩm Mua Lại',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="CreateInvoiceBuyBack"
        component={CreateInvoiceBuyBackScreen} 
        options={{
          headerShown: true,
          title: 'Tạo Hóa Đơn mua lại',
          headerTitleAlign: 'center',
        }}
      />
    </RootStack.Navigator>

  );
};

export default RootNavigator;
