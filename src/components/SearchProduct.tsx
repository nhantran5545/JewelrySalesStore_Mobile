import { TextInput, TouchableOpacity, View, Modal, Button, StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import { BarCodeScanner } from "expo-barcode-scanner";

type SearchProductProps = {
  onSearch: (query: string) => void;
};

const SearchProduct: React.FC<SearchProductProps> = ({ onSearch }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setIsScannerVisible(false);
    setSearchQuery(data);
    onSearch(data);
  };

  const handleScanBarcode = () => {
    setIsScannerVisible(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
            placeholder="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={{
            marginTop: 10,
            width: 52,
            height: 52,
            borderRadius: 26,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleScanBarcode}
        >
          <Icons name="qr-code-scanner" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {isScannerVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isScannerVisible}
          onRequestClose={() => setIsScannerVisible(false)}
        >
          <View style={styles.container}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            <Button title="Close" onPress={() => setIsScannerVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SearchProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
