import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Card, Button, TextInput, IconButton } from 'react-native-paper';

const mockTransactions = [
  { id: 1, desc: 'Ride to Campus', amount: -200, type: 'ride', date: '2024-01-15' },
  { id: 2, desc: 'Added Balance', amount: 1000, type: 'topup', date: '2024-01-14' },
  { id: 3, desc: 'Ride to Office', amount: -150, type: 'ride', date: '2024-01-13' },
  { id: 4, desc: 'Refund - Cancelled Ride', amount: 200, type: 'refund', date: '2024-01-12' },
];

const WalletScreen = () => {
  const [balance, setBalance] = useState(650);
  const [addAmount, setAddAmount] = useState('');

  const handleAdd = () => {
    const amt = parseInt(addAmount, 10);
    if (!isNaN(amt) && amt > 0) {
      setBalance(balance + amt);
      setAddAmount('');
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (type === 'ride') return '🚗';
    if (type === 'topup') return '💰';
    if (type === 'refund') return '↩️';
    return amount > 0 ? '💚' : '💳';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      <Card style={styles.balanceCard}>
        <Card.Content style={styles.balanceContent}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <IconButton icon="refresh" size={20} iconColor="#FFFFFF" />
          </View>
          <Text style={styles.balanceAmount}>Rs. {balance.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>Available for rides</Text>
        </Card.Content>
      </Card>

      <Card style={styles.addMoneyCard}>
        <Card.Content>
          <Text style={styles.addMoneyTitle}>Add Money</Text>
          <TextInput
            label="Amount (Rs.)"
            value={addAmount}
            onChangeText={setAddAmount}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="currency-usd" />}
          />
          <Button 
            mode="contained" 
            onPress={handleAdd} 
            style={styles.addButton}
            icon="plus"
          >
            Add Money
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <ScrollView style={styles.transactionsList}>
          {mockTransactions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
              </Card.Content>
            </Card>
          ) : (
            mockTransactions.map(transaction => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionIcon}>
                      {getTransactionIcon(transaction.type, transaction.amount)}
                    </Text>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDesc}>{transaction.desc}</Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.amount > 0 ? '#34C759' : '#FF3B30' }
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}Rs. {Math.abs(transaction.amount)}
                  </Text>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </View>
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
  balanceCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#007AFF',
  },
  balanceContent: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#B3D9FF',
  },
  addMoneyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
  },
  addMoneyTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    borderRadius: 8,
  },
  transactionsSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  transactionsList: {
    flex: 1,
  },
  transactionCard: {
    marginBottom: 8,
    borderRadius: 12,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  emptyCard: {
    borderRadius: 12,
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
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
});

export default WalletScreen; 