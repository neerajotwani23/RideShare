import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Keyboard,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS } from '../../constants/colors';
import { GOOGLE_API_KEY } from '../../config/env';
import Icon from '../../components/Icon';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useApp } from '../../context/AppContext';

type LocationSelectionParams = {
    typeoflocation: "Pick up Location" | "Drop-off Location";
    location?: {
        latitude: number;
        longitude: number;
    };
    from?: string;
    to?: string;
    fromCoords?: {
        latitude: number;
        longitude: number;
    };
    toCoords?: {
        latitude: number;
        longitude: number;
    };
    onLocationSelected?: (selectedLocation: any) => void;
};

const LocationSelect: React.FC = ({ navigation, route }: any) => {

    const { source, setSource, location, setLocation, destination, setDestination, destinationLocation, defaultLocation, setDestinationLocation } = useApp();
    
    // Separate state for current location (blue dot) and map region
    const [currentLocation, setCurrentLocation] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);
    const { typeoflocation } = route.params;

    const [destselect, setDestselect] = useState(true);
    const [centerLocation, setCenterLocation] = useState<{
        latitude: number;
        longitude: number;
        name: string;
    } | null>(null);
    const [currentLocationText, setCurrentLocationText] = useState('');
    const [isMapReady, setIsMapReady] = useState(false);
    const [selectedLocationName, setSelectedLocationName] = useState('');

    // Initialize map on component mount
    useEffect(() => {
        initializeLocation();
    }, []);

    // Initialize location based on context
    const initializeLocation = () => {
        console.log('📍 Initializing location...');
        getCurrentLocation();
    };

    // Get current location text based on type
    const getCurrentLocationText = () => {
        if (typeoflocation === "Pick up Location") {
            return source || 'Select Pickup Location';
        } else {
            return destination || 'Select Drop-off Location';
        }
    };

    // Get current location
    const getCurrentLocation = () => {
        console.log('📍 Getting current location...');
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('📍 Location received:', { latitude, longitude });
                const currentLocationCoords = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setCurrentLocation(currentLocationCoords);
                setCenterLocation({
                    latitude,
                    longitude,
                    name: 'Current Location',
                });
                setLocation(currentLocationCoords); // Set map region to current location
                setIsMapReady(true);
                console.log('📍 Current location set successfully');
            },
            (error) => {
                console.error('📍 Location error:', error);
                // Set default coordinates (Islamabad, Pakistan)
                const defaultLocationCoords = {
                    latitude: 33.6844,
                    longitude: 73.0479,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setCurrentLocation(defaultLocationCoords);
                setCenterLocation({
                    latitude: 33.6844,
                    longitude: 73.0479,
                    name: 'Default Location',
                });
                setLocation(defaultLocationCoords); // Set map region to default location
                setIsMapReady(true);
                console.log('📍 Default coordinates set');
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
                distanceFilter: 50
            }
        );
    };

    // Handle Google Places API error
    const handleGooglePlacesError = (error: string) => {
        console.warn('Google Places Error:', error);
        Alert.alert(
            'Location Service Error',
            'Unable to load location suggestions. Please check your internet connection and try again.',
            [{ text: 'OK' }]
        );
    };

    // Handle map region change
    const handleMapRegionChange = async (region: any) => {
        // Update center location when map moves
        // The coordinates should represent what's under the red marker
        
        // Always get the location name from coordinates when map moves
        const locationName = await getLocationNameFromCoords(region.latitude, region.longitude);
        
        setCenterLocation({
            latitude: region.latitude,
            longitude: region.longitude,
            name: locationName,
        });
        
        // Clear the selected location name when user moves the map manually
        // This allows the location name to update dynamically
        setSelectedLocationName('');
    };

    // Get location name from coordinates using reverse geocoding
    const getLocationNameFromCoords = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                return data.results[0].formatted_address;
            }
            return 'Selected Location';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return 'Selected Location';
        }
    };

    // Confirm location selection
    const confirmLocation = async () => {
        console.log('📍 confirmLocation called');
        console.log('📍 centerLocation:', centerLocation);
        console.log('📍 typeoflocation:', typeoflocation);

        if (centerLocation) {
            // Get location name if not already set
            let locationName = selectedLocationName;
            if (!locationName) {
                locationName = await getLocationNameFromCoords(centerLocation.latitude, centerLocation.longitude);
            }

            // Update the appropriate location in context
            if (typeoflocation === "Pick up Location") {
                setSource(locationName);
                // Update pickup location coordinates
                setLocation({
                    latitude: centerLocation.latitude,
                    longitude: centerLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            } else {
                setDestination(locationName);
                // Update dropoff location coordinates ONLY
                // Don't update the pickup location (setLocation)
                setDestinationLocation({
                    latitude: centerLocation.latitude,
                    longitude: centerLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }

            console.log('📍 About to go back');
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Please select a location first');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Select {typeoflocation === "Pick up Location" ? 'Pickup' : 'Drop-off'} Location
                </Text>
            </View>

            {/* Search Input with GooglePlacesAutocomplete */}
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder={typeoflocation}
                    listViewDisplayed="auto"
                    predefinedPlaces={[]}
                    currentLocation={true}
                    currentLocationLabel='Current Location'
                    fetchDetails={true}
                    keepResultsAfterBlur={destselect}
                    onPress={(data, details = null) => {
                        setDestselect(false);
                        setSelectedLocationName(data.description);

                        if (data.description === 'Current Location') {
                            if (location && location.latitude && location.longitude) {
                                setCenterLocation({
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    name: data.description,
                                });
                            }
                        } else {
                            if (details && details.geometry && details.geometry.location) {
                                // Only update centerLocation, don't change the current location
                                // This will move the map to bring the selected location under the red marker
                                setCenterLocation({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                    name: data.description,
                                });
                                
                                // Update the map region to center on the selected location
                                // But keep the current location unchanged for the blue dot
                                const newRegion = {
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                };
                                setLocation(newRegion);
                            }
                        }
                        Keyboard.dismiss();
                    }}
                    onFail={handleGooglePlacesError}
                    timeout={10000}
                    query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                        components: 'country:pk',
                        types: 'establishment|geocode',
                    }}
                    GooglePlacesDetailsQuery={{
                        fields: 'formatted_address,geometry',
                    }}
                    GoogleReverseGeocodingQuery={{
                        bounds: 0,
                    }}
                    textInputProps={{
                        value: typeoflocation === "Pick up Location" ? (source ?? '') : (destination ?? ''),
                        onChangeText: typeoflocation === "Pick up Location" ? setSource : setDestination,
                        placeholderTextColor: COLORS.textSecondary,
                        style: styles.autocompleteInput,
                        autoCorrect: false,
                        autoCapitalize: 'none',
                        onFocus: () => {
                            setDestselect(true);
                        },
                    }}
                    styles={{
                        container: { flex: 0 },
                        textInputContainer: styles.autocompleteInputContainer,
                        textInput: styles.autocompleteInput,
                        listView: styles.autocompleteListView,
                        row: styles.autocompleteRow,
                        description: styles.autocompleteDescription,
                        poweredContainer: { display: 'none' },
                    }}
                    enablePoweredByContainer={false}
                    minLength={2}
                    debounce={400}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    GooglePlacesSearchQuery={{
                        rankby: 'distance',
                        type: 'establishment' as any,
                    }}
                    filterReverseGeocodingByTypes={[
                        'locality',
                        'administrative_area_level_3',
                    ]}
                    suppressDefaultStyles={true}

                    enableHighAccuracyLocation={true}
                    disableScroll={true}
                    renderRow={(rowData) => (
                        <View style={styles.rowContainer}>
                            <Icon name="map-marker" size={20} color={COLORS.accent} />
                            <Text style={styles.rowText}>{rowData.description}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
                {location ? (
                    <MapView
                        style={styles.map}
                        region={location}
                        showsUserLocation={true}
                        mapType="standard"
                        userInterfaceStyle="light"
                        onMapReady={() => {
                            console.log('📍 Map is ready');
                            setIsMapReady(true);
                        }}
                        onRegionChangeComplete={handleMapRegionChange}
                    >
                        {/* Current Location Marker - Blue Dot */}
                        {currentLocation && (
                            <Marker coordinate={currentLocation}>
                                <View style={styles.blueDot} />
                            </Marker>
                        )}
                    </MapView>
                ) : (
                    <View style={styles.mapLoading}>
                        <Text style={styles.mapLoadingText}>Loading map...</Text>
                    </View>
                )}
                {/* Fixed Center Marker */}
                <View style={styles.centerMarker}>
                    <Icon name="map-marker" size={30} color="#FF3B30" />
                </View>
            </View>

            {/* Center Location Info */}
            {centerLocation && (
                <Card style={styles.locationCard}>
                    <Card.Content>
                        <Text style={styles.locationTitle}>
                            {typeoflocation}
                        </Text>
                        <Text style={styles.locationName}>{centerLocation.name}</Text>
                        <Text style={styles.locationCoords}>
                            {centerLocation.latitude.toFixed(6)}, {centerLocation.longitude.toFixed(6)}
                        </Text>
                    </Card.Content>
                </Card>
            )}

            {/* Confirm Button */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={confirmLocation}
                    disabled={!centerLocation}
                    style={[
                        styles.confirmButton,
                        !centerLocation && styles.disabledButton
                    ]}
                    labelStyle={styles.buttonText}
                >
                    Confirm {typeoflocation === "Pick up Location" ? 'Pickup' : 'Drop-off'} Location
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        fontSize: 16,
        color: COLORS.accent,
        fontFamily: 'Montserrat-Medium',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.secondary,
        textAlign: 'center',
        marginRight: 40, // Compensate for back button
    },
    searchContainer: {
        padding: 16,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        zIndex: 1000,
    },
    autocompleteInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
    },
    autocompleteInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.secondary,
        backgroundColor: 'transparent',
    },
    autocompleteListView: {
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        maxHeight: 200,
        marginTop: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    autocompleteRow: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    autocompleteDescription: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.secondary,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    rowText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.secondary,
        flex: 1,
    },
    mapContainer: {
        flex: 1,
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    mapLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
    },
    mapLoadingText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: COLORS.textSecondary,
    },
    blueDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#248CFE',
        borderWidth: 3,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    locationCard: {
        margin: 16,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.accent,
        marginBottom: 4,
    },
    locationName: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: COLORS.secondary,
        marginBottom: 4,
    },
    locationCoords: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.textSecondary,
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: COLORS.primary,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    confirmButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 12,
        paddingVertical: 4,
    },
    disabledButton: {
        backgroundColor: COLORS.border,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.primary,
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -15,
        marginTop: -30,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LocationSelect;