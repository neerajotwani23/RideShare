import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from '../../components/Icon';

const mockNotifications = [
  { 
    id: 1, 
    message: 'Your ride with Sara is confirmed for 28 June, 9:00 AM.',
    type: 'ride_confirmed',
    time: '2 hours ago'
  },
  { 
    id: 2, 
    message: 'Your booking was cancelled successfully.',
    type: 'ride_cancelled',
    time: '1 day ago'
  },
  { 
    id: 3, 
    message: 'App update available! Please update for new features.',
    type: 'app_update',
    time: '2 days ago'
  },
  {
    id: 4,
    message: 'Payment received for your ride to Campus.',
    type: 'payment',
    time: '3 days ago'
  },
  {
    id: 5,
    message: 'New review received from your recent passenger.',
    type: 'review',
    time: '1 week ago'
  }
];

const NotificationsScreen = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ride_confirmed':
        return { name: 'check-circle', color: '#248CFE' };
      case 'ride_cancelled':
        return { name: 'close-circle', color: '#FF3B30' };
      case 'app_update':
        return { name: 'update', color: '#248CFE' };
      case 'payment':
        return { name: 'currency-inr', color: '#FF9500' };
      case 'review':
        return { name: 'star', color: '#FFD700' };
      default:
        return { name: 'bell', color: '#666666' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {mockNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={64} color="#999999" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>You'll see important updates here</Text>
          </View>
        ) : (
          mockNotifications.map(notification => {
            const icon = getNotificationIcon(notification.type);
            return (
              <Card key={notification.id} style={styles.notificationCard}>
                <Card.Content style={styles.notificationContent}>
                  <View style={styles.notificationLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                      <Icon name={icon.name} size={20} color={icon.color} />
                    </View>
                    <View style={styles.notificationDetails}>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <View style={styles.timeContainer}>
                        <Icon name="clock-outline" size={12} color="#999999" />
                        <Text style={styles.timeText}>{notification.time}</Text>
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  notificationContent: {
    paddingVertical: 12,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    lineHeight: 20,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#999999',
    marginLeft: 4,
  },
});

export default NotificationsScreen; 