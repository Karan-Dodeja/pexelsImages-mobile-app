import { View, Text } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./imageCard";
import { getColumnCount } from "../helpers/common";

const ImageGrid = ({ images, router }) => {
  const columns = getColumnCount();
  return (
    <View styles={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        renderItem={({ item }) => (
          <ImageCard
            item={item}
            index={index}
            columns={columns}
            router={router}
          />
        )}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainerStyle}
        initialNumberToRender={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});

export default ImageGrid;
