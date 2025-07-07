import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from '../../components/Icon';
import { COLORS } from '../../constants/colors';

const HelpSupportScreen = ({ navigation }: any) => {
  const handleCall = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CONTACT</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            142 Steiner Street, San Francisco, CA, 94115
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail us</Text>
          <Text style={styles.value}>florian@instamobile.io</Text>
        </View>
      </View>

      {/* Call Us Button */}
      <Button
        mode="contained"
        style={styles.callButton}
        labelStyle={styles.callButtonLabel}
        onPress={handleCall}
      >
        Call Us
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textAlign: 'center',
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.primary,
    marginTop: 16,
    paddingHorizontal: 0,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Medium',
    flex: 2,
    textAlign: 'right',
  },
  callButton: {
    margin: 24,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    elevation: 0,
  },
  callButtonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

export default HelpSupportScreen; 