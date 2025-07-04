import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Avatar, TextInput } from 'react-native-paper';

const RateRideScreen = ({ navigation, route }: any) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmitReview = () => {
    console.log('Review submitted:', { rating, review });
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Navigate to My Rides if no previous screen
      navigation.navigate('My Rides');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index)}
        style={styles.starButton}
      >
        <Text style={[
          styles.star,
          { color: index < rating ? '#FFD700' : '#E0E0E0' }
        ]}>
          ⭐
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rate Your Ride</Text>
        </View>

        <Card style={styles.completionCard}>
          <Card.Content style={styles.completionContent}>
            <Text style={styles.checkmark}>✅</Text>
            <Text style={styles.completionTitle}>Ride Completed!</Text>
          </Card.Content>
        </Card>

        <Card style={styles.personCard}>
          <Card.Content style={styles.personContent}>
            <Avatar.Text size={60} label="JD" />
            <View style={styles.personInfo}>
              <Text style={styles.personName}>John Doe</Text>
              <Text style={styles.personRole}>Driver</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.ratingCard}>
          <Card.Content style={styles.ratingContent}>
            <Text style={styles.ratingTitle}>Rate your experience</Text>
            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
          </Card.Content>
        </Card>

        {rating > 0 && (
          <Card style={styles.reviewCard}>
            <Card.Content>
              <TextInput
                value={review}
                onChangeText={setReview}
                placeholder="Share your experience..."
                multiline
                numberOfLines={4}
                style={styles.reviewInput}
                mode="outlined"
              />
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={handleSubmitReview}
          style={styles.submitButton}
        >
          Submit Review
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  completionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  completionContent: {
    alignItems: 'center',
    padding: 24,
  },
  checkmark: {
    fontSize: 48,
  },
  completionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  personCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  personContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  personInfo: {
    flex: 1,
    marginLeft: 16,
  },
  personName: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  personRole: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  ratingCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  ratingContent: {
    alignItems: 'center',
    padding: 24,
  },
  ratingTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
  },
  reviewCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  reviewInput: {
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
});

export default RateRideScreen; 