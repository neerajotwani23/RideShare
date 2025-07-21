import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, IconButton, Avatar, Divider, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';



const ReviewsScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<'received' | 'given'>('received');
  const { reviewsReceived, reviewsGiven, refreshReviews, isLoading, isRefreshing } = useApp();

  // Use real data or fallback to defaults
  const reviews = selectedTab === 'received' ? reviewsReceived : reviewsGiven;
  const totalReviews = reviews.length;
  
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.stars, 0) / totalReviews).toFixed(1)
    : '5.0';

  // Calculate rating breakdown
  const ratingBreakdown = [
    { label: 'Excellent', count: reviews.filter(r => r.stars === 5).length, percentage: totalReviews > 0 ? Math.round((reviews.filter(r => r.stars === 5).length / totalReviews) * 100) : 0, color: COLORS.success },
    { label: 'Good', count: reviews.filter(r => r.stars === 4).length, percentage: totalReviews > 0 ? Math.round((reviews.filter(r => r.stars === 4).length / totalReviews) * 100) : 0, color: '#4CAF50' },
    { label: 'Average', count: reviews.filter(r => r.stars === 3).length, percentage: totalReviews > 0 ? Math.round((reviews.filter(r => r.stars === 3).length / totalReviews) * 100) : 0, color: '#FFC107' },
    { label: 'Below Average', count: reviews.filter(r => r.stars === 2).length, percentage: totalReviews > 0 ? Math.round((reviews.filter(r => r.stars === 2).length / totalReviews) * 100) : 0, color: '#FF9800' },
    { label: 'Poor', count: reviews.filter(r => r.stars === 1).length, percentage: totalReviews > 0 ? Math.round((reviews.filter(r => r.stars === 1).length / totalReviews) * 100) : 0, color: COLORS.error },
  ];

  useEffect(() => {
    refreshReviews();
  }, []);



  const renderStars = (rating: number, size: number = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={size}
            color={star <= rating ? '#FFD700' : '#E0E0E0'}
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  const renderRatingBar = (label: string, percentage: number, color: string) => (
    <View style={styles.ratingBarContainer}>
      <Text style={styles.ratingBarLabel}>{label}</Text>
      <View style={styles.ratingBarWrapper}>
        <View style={[styles.ratingBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.ratingBarPercentage}>{percentage}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS.secondary}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 48 }} />
      </View>

      {isLoading || isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshReviews}
              colors={[COLORS.accent]}
              tintColor={COLORS.accent}
            />
          }
        >
          {/* Average Rating Section */}
          <Card style={styles.ratingCard}>
            <Card.Content style={styles.ratingContent}>
              <View style={styles.averageRatingContainer}>
                <Text style={styles.averageRating}>{averageRating}</Text>
                {renderStars(parseFloat(averageRating), 24)}
                <Text style={styles.reviewCount}>based on {totalReviews} reviews</Text>
              </View>
            </Card.Content>
          </Card>

        {/* Rating Breakdown */}
        <Card style={styles.breakdownCard}>
          <Card.Content style={styles.breakdownContent}>
            <Text style={styles.breakdownTitle}>Rating Breakdown</Text>
            {ratingBreakdown.map((item, index) => (
              <View key={index}>
                {renderRatingBar(item.label, item.percentage, item.color)}
                {index < ratingBreakdown.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'received' && styles.activeTab]}
            onPress={() => setSelectedTab('received')}
          >
            <Text style={[styles.tabText, selectedTab === 'received' && styles.activeTabText]}>
              Reviews Received
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'given' && styles.activeTab]}
            onPress={() => setSelectedTab('given')}
          >
            <Text style={[styles.tabText, selectedTab === 'given' && styles.activeTabText]}>
              Reviews Given
            </Text>
          </TouchableOpacity>
        </View>

        {/* Individual Reviews */}
        <View style={styles.reviewsContainer}>
          {reviews.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="star-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                <Text style={styles.emptySubtext}>
                  {selectedTab === 'received' 
                    ? 'You haven\'t received any reviews yet.' 
                    : 'You haven\'t given any reviews yet.'}
                </Text>
              </Card.Content>
            </Card>
          ) : (
            reviews.map((review, index) => (
              <Card key={review.id} style={styles.reviewCard}>
                <Card.Content style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Avatar.Icon 
                        size={40} 
                        icon="account" 
                        style={styles.avatar}
                        color={COLORS.secondary}
                      />
                      <View style={styles.reviewerDetails}>
                        <Text style={styles.reviewerName}>
                          {selectedTab === 'received' ? review.reviewer?.first_name || 'Anonymous' : review.reviewee?.first_name || 'Anonymous'}
                        </Text>
                        <Text style={styles.reviewDate}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      <Text style={styles.ratingNumber}>{review.stars}.0</Text>
                      {renderStars(review.stars, 16)}
                    </View>
                  </View>
                  {review.text_review && (
                    <Text style={styles.reviewComment}>{review.text_review}</Text>
                  )}
              </Card.Content>
            </Card>
          ))
        )}
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  scrollView: {
    flex: 1,
  },
  ratingCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  ratingContent: {
    padding: 24,
    alignItems: 'center',
  },
  averageRatingContainer: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 48,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    marginHorizontal: 2,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  breakdownCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  breakdownContent: {
    padding: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingBarLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    width: 100,
  },
  ratingBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    borderRadius: 4,
  },
  ratingBarPercentage: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    width: 30,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: COLORS.border,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  reviewsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  reviewCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  reviewContent: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: COLORS.lightGray,
    marginRight: 12,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  reviewRating: {
    alignItems: 'flex-end',
  },
  ratingNumber: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  emptyContent: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ReviewsScreen; 