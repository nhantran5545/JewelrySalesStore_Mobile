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
import OrderListScreen from "../screens/OrderListScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import CartBuyBackScreen from "../screens/CartBuyBackScreen";
import OrderListPaidScreen from "../screens/OrderListPaidScreen";
import ChooseCustomer from "../screens/ChooseCustomer";
import CreateOrderBuyBackStoreScreen from "../screens/CreateOrderBuyBackStoreScreen";
import LoginScreen from "../screens/LoginScreen";
import OrderListBuyBackScreen from "../screens/OrderListBuyBackScreen";
import OrderDetailBuyBackScreen from "../screens/OrderDetailBuyBackScreen";

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
  CreateInvoiceBuyBack: { customer: Customer };
  OrderList: undefined;
  OrderDetail: { orderSellId: number };
  CartBuyBack: undefined;
  OrderListPaid: undefined;
  ChooseCustomer: undefined;
  CreateInvoiceBuyBackStore: { customer: Customer };
  Login: undefined;
  OrderListBuyBack: undefined;
  OrderDetailBuyBack: {orderBuyBackId: number};
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
        name="Login"
        component={LoginScreen}  
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
      <RootStack.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{
          headerShown: true,
          title: 'Danh sách các hóa đơn',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: true,
          title: 'Chi tiết Hóa Đơn',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="CartBuyBack"
        component={CartBuyBackScreen}
        options={{
          headerShown: true,
          title: 'Giỏ Hàng Mua Lại',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="OrderListPaid"
        component={OrderListPaidScreen}
        options={{
          headerShown: true,
          title: 'Danh sách các hóa đơn',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="ChooseCustomer"
        component={ChooseCustomer}
        options={{
          headerShown: true,
          title: 'Chọn Khách Hàng',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="CreateInvoiceBuyBackStore"
        component={CreateOrderBuyBackStoreScreen}
        options={{
          headerShown: true,
          title: 'Tạo Hóa Đơn Mua Lại',
          headerTitleAlign: 'center',
        }}
      />
       <RootStack.Screen
        name="OrderListBuyBack"
        component={OrderListBuyBackScreen}
        options={{
          headerShown: true,
          title: 'Danh sách hóa đơn mua lại',
          headerTitleAlign: 'center',
        }}
      />
      <RootStack.Screen
        name="OrderDetailBuyBack"
        component={OrderDetailBuyBackScreen}
        options={{
          headerShown: true,
          title: 'Chi tiết hóa đon mua lại',
        }}
      />
    </RootStack.Navigator>

  );
};

export default RootNavigator;
