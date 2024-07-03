import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { getImageSize } from "../helpers/common";
import { theme } from "../constants/theme";

const ImageCard = ({ item, index }) => {
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };
  const isLastrow = () => {
    return (index + 1) % columns === 0;
  };
  return (
    <Pressable style={[styles.imageWrapper, !isLastrow() && styles.spacing]}>
      <Image
        style={[styles.image, getImageHeight()]}
        source={item?.webformatURL}
        transition={100}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
});

export default ImageCard;
