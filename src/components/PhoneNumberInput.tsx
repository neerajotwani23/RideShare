import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Menu, IconButton } from 'react-native-paper';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { COLORS } from '../constants/colors';

interface Country {
  code: string;
  callingCode: string;
  flag: string;
  name: string;
}

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  style?: any;
  mode?: 'outlined' | 'flat';
  outlineColor?: string;
  activeOutlineColor?: string;
  theme?: any;
  contentStyle?: any;
  disabled?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChangeText,
  error,
  label = "Phone Number",
  placeholder,
  style,
  mode = "outlined",
  outlineColor = COLORS.border,
  activeOutlineColor = COLORS.secondary,
  theme,
  contentStyle,
  disabled = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'PK',
    callingCode: '+92',
    flag: 'PK',
    name: 'Pakistan'
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const countries: Country[] = [
    { code: 'PK', callingCode: '+92', flag: 'PK', name: 'Pakistan' },
    { code: 'US', callingCode: '+1', flag: 'US', name: 'United States' },
    { code: 'GB', callingCode: '+44', flag: 'GB', name: 'United Kingdom' },
    { code: 'CA', callingCode: '+1', flag: 'CA', name: 'Canada' },
    { code: 'AU', callingCode: '+61', flag: 'AU', name: 'Australia' },
    { code: 'IN', callingCode: '+91', flag: 'IN', name: 'India' },
  ];

  // Initialize phone number from value prop
  useEffect(() => {
    if (value) {
      // Extract country code and phone number from full value
      const country = countries.find(c => value.startsWith(c.callingCode));
      if (country) {
        setSelectedCountry(country);
        const phonePart = value.replace(country.callingCode, '').trim();
        setPhoneNumber(formatPhoneNumber(phonePart, country.code));
      } else {
        // Default to Pakistan if no country code found
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setPhoneNumber('');
    setPhoneError('');
    setShowCountryMenu(false);
    // Notify parent with empty value when country changes
    onChangeText('');
  };

  const formatPhoneNumber = (text: string, countryCode: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    switch (countryCode) {
      case 'US':
      case 'CA':
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
      case 'PK':
        if (cleaned.length <= 3) return cleaned;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 10)}`;
      default:
        return cleaned;
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text, selectedCountry.code);
    setPhoneNumber(formatted);
    
    if (text.length > 0) {
      try {
        const fullNumber = `${selectedCountry.callingCode}${text.replace(/\D/g, '')}`;
        const isValid = isValidPhoneNumber(fullNumber);
        if (!isValid && text.replace(/\D/g, '').length > 3) {
          setPhoneError('Invalid phone number format');
        } else {
          setPhoneError('');
        }
      } catch (error) {
        if (text.replace(/\D/g, '').length > 3) {
          setPhoneError('Invalid phone number format');
        }
      }
    } else {
      setPhoneError('');
    }

    // Notify parent with full phone number including country code
    const fullNumber = `${selectedCountry.callingCode}${text.replace(/\D/g, '')}`;
    onChangeText(fullNumber);
  };

  const getPhonePlaceholder = (countryCode: string) => {
    switch (countryCode) {
      case 'US':
      case 'CA':
        return 'Enter phone number';
      case 'PK':
        return '300 1234567';
      default:
        return 'Enter phone number';
    }
  };

  const displayError = error || phoneError;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.phoneContainer}>
        <Menu
          visible={showCountryMenu}
          onDismiss={() => setShowCountryMenu(false)}
          anchor={
            <TouchableOpacity
              style={[styles.countrySelector, disabled && styles.disabledSelector]}
              onPress={() => !disabled && setShowCountryMenu(true)}
              disabled={disabled}
            >
              <Text style={styles.countryCode}>
                {selectedCountry.flag} {selectedCountry.callingCode}
              </Text>
              <IconButton 
                icon="chevron-down" 
                size={20} 
                iconColor={COLORS.textSecondary} 
                style={styles.chevronIcon} 
              />
            </TouchableOpacity>
          }
        >
          {countries.map((country) => (
            <Menu.Item
              key={country.code}
              onPress={() => handleCountryChange(country)}
              title={`${country.flag} ${country.name} ${country.callingCode}`}
            />
          ))}
        </Menu>
        
        <TextInput
          label={label}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          style={styles.phoneInput}
          mode={mode}
          outlineColor={outlineColor}
          activeOutlineColor={activeOutlineColor}
          placeholder={placeholder || getPhonePlaceholder(selectedCountry.code)}
          error={!!displayError}
          contentStyle={contentStyle}
          theme={theme}
          disabled={disabled}
        />
      </View>
      {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
    justifyContent: 'space-between',
  },
  disabledSelector: {
    opacity: 0.5,
  },
  countryCode: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  chevronIcon: {
    margin: 0,
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.error,
    marginTop: 4,
  },
});

export default PhoneNumberInput; 