import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

const mockNotifications = [
  { id: 1, message: 'Your ride with Sara is confirmed for 28 June, 9:00 AM.' },
  { id: 2, message: 'Your booking was cancelled successfully.' },
  { id: 3, message: 'App update available! Please update for new features.' },
];

const NotificationsScreen = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Notifications</Text>
      <ScrollView>
        {mockNotifications.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 32 }}>No notifications yet.</Text>
        ) : (
          mockNotifications.map(n => (
            <Card key={n.id} style={{ marginBottom: 12 }}>
              <Card.Content>
                <Text>{n.message}</Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen; 