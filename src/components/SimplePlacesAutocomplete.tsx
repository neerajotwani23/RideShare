import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { GOOGLE_API_KEY } from '../config/env';
import { COLORS } from '../constants/colors';

interface Place {
  place_id: string;
  description: string;
}

interface SimplePlacesAutocompleteProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectPlace: (place: Place) => void;
  style?: any;
}

const SimplePlacesAutocomplete: React.FC<SimplePlacesAutocompleteProps> = ({
  placeholder,
  value,
  onChangeText,
  onSelectPlace,
  style
}) => {
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    if (value.length > 2) {
      fetchPredictions(value);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [value]);

  const fetchPredictions = async (input: string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&types=geocode`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        setPredictions(data.predictions);
        setShowPredictions(true);
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handleSelectPlace = (place: Place) => {
    onSelectPlace(place);
    setShowPredictions(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={COLORS.textSecondary}
      />
      {showPredictions && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() => handleSelectPlace(item)}
              >
                <Text style={styles.predictionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.predictionsList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.secondary,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  predictionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1001,
  },
  predictionsList: {
    maxHeight: 200,
  },
  predictionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  predictionText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
});

export default SimplePlacesAutocomplete; 