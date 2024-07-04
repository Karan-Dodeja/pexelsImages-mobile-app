import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { ScrollView, TextInput } from "react-native-web";
import { useCallback, useEffect, useRef, useState } from "react";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/imageGrid";
import FiltersModal from "../../components/filtersModal";

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaFrame();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const scrollRef = useRef(null);
  const [filters, setFilters] = useState(null);
  const modalRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    console.log("params:", params, append);
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
    console.log("got results: ", res.data?.hits[0]);
  };

  const openFiltersModal = () => {
    modalRef?.current?.present();
  };

  const closeFiltersModal = () => {
    modalRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages();
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) {
        params.category = activeCategory;
      }
      if (search) {
        params.q = search;
      }
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages();
      let params = {
        page,
      };
      if (activeCategory) {
        params.category = activeCategory;
      }
      if (search) {
        params.q = search;
      }
      fetchImages(params, false);
    }

    closeFiltersModal();
  };

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cat) {
      params.category = cat;
    }
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) {
      params.category = activeCategory;
    }
    if (search) {
      params.q = search;
    }
    fetchImages(params, false);
  };

  const handleScroll = (e) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        // fetch images
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) {
          params.category = activeCategory;
        }
        if (search) {
          params.q = search;
        }
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = (e) => {
    scrollRef?.current?.scrollTop({
      y: 0,
      animated: true,
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
        <ScrollView contentContainerStyle={{ gap: 15 }}>
          <View style={styles.searchbar}>
            <View style={styles.searchIcon}>
              <Feather
                name="search"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </View>
            <TextInput
              placeholder="Search for photos..."
              style={styles.searchInput}
              ref={searchInputRef}
              onChangeText={handleTextDebounce}
            />
            {search && (
              <Pressable
                onPress={() => handleSearch("")}
                style={styles.closeIcon}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.neutral(0.6)}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.categories}>
            <Categories
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          </View>
          {/* Show filters */}
          {filters && (
            <View>
              <ScrollView
                horizontal
                showHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={5}
                ref={scrollRef}
                contentContainerStyle={styles.filters}
              >
                {Object.keys(filters).map((key, index) => {
                  return (
                    <View key={key} style={styles.filterItem}>
                      {key == "colors" ? (
                        <View
                          style={{
                            height: 20,
                            width: 30,
                            borderRadius: 7,
                            backgroundColor: filters[key],
                          }}
                        />
                      ) : (
                        <Text style={styles.filterItemText}>
                          {filters[key]}
                        </Text>
                      )}

                      <Pressable
                        style={styles.filterCloseIcon}
                        onPress={() => clearThisFilter(key)}
                      >
                        <Ionicons
                          name="close"
                          size={14}
                          color={theme.colors.neutral(0.9)}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {/* Images Masonry Grid */}
          <View>{images.length > 0 && <ImageGrid images={images} />}</View>
          {/* Loading */}
          <View
            style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
          >
            <ActivityIndicator size="large" />
          </View>
        </ScrollView>
        <FiltersModal
          filters={filters}
          setFilters={setFilters}
          onClose={closeFiltersModal}
          onApply={applyFilters}
          onReset={resetFilters}
          modalRef={modalRef}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchbar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});

export default HomeScreen;
