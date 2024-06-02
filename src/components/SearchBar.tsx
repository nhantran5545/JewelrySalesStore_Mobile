import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop";
import FilterView from "./FilterView";

const SearchBar = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const openFilterModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const { colors } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: "row", paddingHorizontal: 24, gap: 12 }}>
        <View
          style={{
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
            placeholder="Tìm kiếm sản phẩm"
          />
        </View>

        <TouchableOpacity
          onPress={openFilterModal}
          style={{
            width: 52,
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 52,
            backgroundColor: colors.primary,
          }}
        >
          <Icons name="tune" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
      <BottomSheetModal
        snapPoints={["85%"]}
        index={0}
        ref={bottomSheetModalRef}
        backdropComponent={(props) => <CustomBackdrop {...props} />}
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: colors.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.primary,
        }}
      >
        <FilterView />
      </BottomSheetModal>
    </View>
  );
};
export default SearchBar;
