import React from 'react';
import { View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

const mockBooking = {
  id: 1,
  ride: { from: 'Downtown', to: 'Campus', date: '2025-06-28', time: '09:00 AM' },
  status: 'Confirmed',
  seats: 2,
  fare: 400,
};

const BookingDetailsScreen = () => {
  const booking = mockBooking;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Booking Details</Text>
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text>From: {booking.ride.from}</Text>
          <Text>To: {booking.ride.to}</Text>
          <Text>Date: {booking.ride.date} at {booking.ride.time}</Text>
          <Text>Seats Booked: {booking.seats}</Text>
          <Text>Total Fare: Rs. {booking.fare}</Text>
          <Text>Status: {booking.status}</Text>
        </Card.Content>
      </Card>
      <Button mode="contained" style={{ marginTop: 16 }}>Cancel Booking</Button>
    </View>
  );
};

export default BookingDetailsScreen; 