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

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
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
        }}
      />
      <RootStack.Screen
        name="CustomerInfo1"
        component={CustomerInfoScreen}
        options={{
          headerShown: true,
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
    </RootStack.Navigator>

  );
};

export default RootNavigator;
