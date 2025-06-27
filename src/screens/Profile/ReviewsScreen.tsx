import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';

const mockReviews = [
  { id: 1, user: 'Ahmed', rating: 5, comment: 'Great ride, very punctual!' },
  { id: 2, user: 'Sara', rating: 4, comment: 'Comfortable and safe.' },
];

const ReviewsScreen = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Reviews</Text>
      <ScrollView>
        {mockReviews.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 32 }}>No reviews yet.</Text>
        ) : (
          mockReviews.map(review => (
            <Card key={review.id} style={{ marginBottom: 12 }}>
              <Card.Title
                title={review.user}
                left={props => <Avatar.Icon {...props} icon="account" />}
                right={props => <Text style={{ marginRight: 16 }}>⭐ {review.rating}</Text>}
              />
              <Card.Content>
                <Text>{review.comment}</Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
      <Button mode="contained" style={{ marginTop: 16 }}>Add Review</Button>
    </View>
  );
};

export default ReviewsScreen; 