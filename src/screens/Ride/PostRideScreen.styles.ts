import { StyleSheet, Dimensions } from 'react-native';
import { lightColors } from '../../constants/colors';

const { height: screenHeight } = Dimensions.get('window');

// Create styles function that accepts colors
export const createStyles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  mapContainer: {
    height: screenHeight * 0.45,
    backgroundColor: colors.lightGray,
  },
  map: {
    flex: 1,
  },
  absoluteSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.6,
    backgroundColor: 'transparent',
  },
  bottomSheet: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
    height: '100%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: colors.textPrimary,
    backgroundColor: colors.inputBackground,
  },
  dropdown: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Montserrat-Regular',
  },
  rideTypeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 4,
  },
  rideTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rideTypeButtonActive: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideTypeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.textSecondary,
  },
  rideTypeTextActive: {
    color: colors.primary,
    fontFamily: 'Montserrat-Bold',
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: colors.textPrimary,
  },
  preferencesContainer: {
    marginBottom: 16,
  },
  preferencesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferenceButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  preferenceButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  preferenceText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: colors.textSecondary,
  },
  preferenceTextActive: {
    color: colors.primary,
    fontFamily: 'Montserrat-Bold',
  },
  postButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postButtonText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: colors.primary,
  },
}); 