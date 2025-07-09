import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import CustomButton from './CustomButton';

interface RideFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  carType: string[];
  amenities: string[];
  rating: number;
}

const RideFilters: React.FC<RideFiltersProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    carType: [],
    amenities: [],
    rating: 0,
  });

  const amenitiesList = ['AC', 'Music OK', 'No Smoking', 'Pet Friendly'];
  const carTypes = ['Any', 'Sedan', 'SUV', 'Hatchback'];

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleCarTypeSelect = (type: string) => {
    setFilters(prev => ({
      ...prev,
      carType: prev.carType.includes(type)
        ? prev.carType.filter(t => t !== type)
        : [...prev.carType, type],
    }));
  };

  const handlePriceChange = (value: string, isMin: boolean) => {
    const numValue = parseInt(value) || 0;
    setFilters(prev => ({
      ...prev,
      priceRange: isMin 
        ? [numValue, prev.priceRange[1]]
        : [prev.priceRange[0], numValue],
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Rides</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceInputContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceLabel}>Min Price</Text>
                  <View style={styles.priceInputField}>
                    <Text style={styles.currencyPrefix}>Rs.</Text>
                    <TextInput
                      style={styles.priceInput}
                      keyboardType="numeric"
                      value={filters.priceRange[0].toString()}
                      onChangeText={(value) => handlePriceChange(value, true)}
                      placeholder="0"
                    />
                  </View>
                </View>
                <View style={styles.priceInputDivider} />
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceLabel}>Max Price</Text>
                  <View style={styles.priceInputField}>
                    <Text style={styles.currencyPrefix}>Rs.</Text>
                    <TextInput
                      style={styles.priceInput}
                      keyboardType="numeric"
                      value={filters.priceRange[1].toString()}
                      onChangeText={(value) => handlePriceChange(value, false)}
                      placeholder="1000"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              {/* Car Type filter removed */}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.optionsGrid}>
                {amenitiesList.map(amenity => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.optionButton,
                      filters.amenities.includes(amenity) && styles.optionSelected,
                    ]}
                    onPress={() => handleAmenityToggle(amenity)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.amenities.includes(amenity) && styles.optionTextSelected,
                    ]}>
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              onPress={() => setFilters({
                priceRange: [0, 1000],
                carType: [],
                amenities: [],
                rating: 0,
              })}
              mode="contained"
              style={styles.footerButton}
              textColor="#FFFFFF"
              buttonColor="#0A80ED"
            >
              Reset
            </CustomButton>
            <CustomButton
              onPress={() => {
                onApply(filters);
                onClose();
              }}
              style={styles.footerButton}
              textColor="#FFFFFF"
              buttonColor="#0A80ED"
            >
              Apply
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0A80ED',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currencyPrefix: {
    color: '#666',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  priceInputDivider: {
    width: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    margin: 6,
    minWidth: '45%',
  },
  optionSelected: {
    backgroundColor: '#0A80ED',
    borderColor: '#0A80ED',
  },
  optionText: {
    textAlign: 'center',
    color: '#666',
  },
  optionTextSelected: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 6,
  },
});

export default RideFilters; 