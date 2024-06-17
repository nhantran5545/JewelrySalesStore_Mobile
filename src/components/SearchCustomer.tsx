import { TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";

type SearchCustomerProps = {
  onSearch: (query: string) => void;
};

const SearchCustomer: React.FC<SearchCustomerProps> = ({ onSearch }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", paddingHorizontal: 24, gap: 12 }}>
        <View
          style={{
            marginTop: 10,
            flex: 1,
            height: 52,
            borderRadius: 52,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            paddingHorizontal: 24,
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Icons
            name="search"
            size={24}
            color={colors.text}
            style={{ opacity: 0.5 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: colors.text,
              opacity: 0.5,
            }}
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default SearchCustomer;
