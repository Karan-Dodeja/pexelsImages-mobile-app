import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { capitalize } from "../helpers/common";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const OrderView = ({ data, filters, setFilters, filerName }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [filerName]: item });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[firstname] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={item}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilter = ({ data, filters, setFilters, filerName }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [filerName]: item });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[firstname] == item;
          let borderColor = isActive ? theme.colors.neutral(0.4) : "white";

          return (
            <Pressable onPress={() => onSelect(item)} key={item}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { gap: 8 },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
  colorWrapper: {
    borderWidth: 2,
    borderCurve: "continuous",
    padding: 3,
    borderRadius: 3,
  },
});
