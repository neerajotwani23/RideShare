import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from '../../constants/colors';
import { Colors } from "react-native/Libraries/NewAppScreen";

const { height: screenHeight } = Dimensions.get('window'); 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  mapPlaceholder: {
    height: screenHeight * 0.45,
    backgroundColor: COLORS.lightGray,
    zIndex: 1, // Ensure map stays below the bottom sheet
  },
  absoluteSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.55,
    backgroundColor: 'transparent',
    zIndex: 2, // Place bottom sheet above the map
  },
  bottomSheet: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomWidth: 0,
    height: '100%', // Fill the absoluteSheet
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
  },
  nowCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nowContent: {
    alignItems: 'center',
    padding: 8,
  },
  nowIcon: {
    marginBottom: 8,
  },
  nowTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#248CFE',
    marginBottom: 4,
  },
  nowSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTime: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#248CFE',
    marginLeft: 4,
  },
  scheduleCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  detailsCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  preferencesCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
  },
  dateTimeContent: {
    alignItems: 'flex-start',
  },
  dateTimeLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 8,
  },
  postButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 12,
  },

  // Autocomplete styles
autocompleteContainer: {
  flexDirection: 'row',         // Align children in a row
  alignItems: 'center',         // Center items vertically
  marginBottom: 16,
  position: 'relative',
  borderColor: '#D3D3D3',       // Light gray color for the border
  borderWidth: 1,
  borderRadius: 20,             // Use a number for radius
  padding: 10,                  // Add padding inside the border
  backgroundColor: 'white',      // Set background to white for better visibility
},

touchableContainer: {
  flex: 1,                      // Allow the TouchableOpacity to fill space
  padding: 10,                  // Add padding for better touch area
  justifyContent: 'center',      // Center text vertically
  marginLeft: 30,               // Add margin to create a gap between the icon and the button
},

touchableText: {
  color: COLORS.secondary || 'black', // Ensure text color is set (use a fallback if necessary)
  fontSize: 16,                 // Set a font size for visibility
},



autocompleteIcon: {
  position: 'absolute',
  left: 16,
  top: 18,
  zIndex: 1,
},
  autocompleteInputContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingLeft: 40,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',

  },
  autocompleteInput: {
    backgroundColor: 'transparent',
    height: 40,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },

  autocompleteListView: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    position: 'absolute',
    top: 56, // Position it below the input field itself
    left: 0,
    right: 0,
    zIndex: 9999, // Extremely high zIndex to ensure it's always on top
    elevation: 20,
  },
  autocompleteRow: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  autocompleteDescription: {
    color: COLORS.secondary,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5, // Spacing above and below each row
    paddingHorizontal: 5, // Spacing on left and right
    backgroundColor: COLORS.primary, // Match your app's theme
    gap: 10
  },
  // Map Marker Styles
  currentLocationDot: {
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
  blueMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  greenMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});