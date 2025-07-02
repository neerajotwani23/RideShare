import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import Icon from '../../components/Icon';

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
    if (type === 'ride') return 'car';
    if (type === 'topup') return 'plus-circle';
    if (type === 'refund') return 'refresh';
    return amount > 0 ? 'plus' : 'minus';
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (type === 'ride') return '#FF3B30';
    if (type === 'topup') return '#34C759';
    if (type === 'refund') return '#007AFF';
    return amount > 0 ? '#34C759' : '#FF3B30';
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
            <TouchableOpacity>
              <Icon name="refresh" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceAmountContainer}>
            <Icon name="currency-inr" size={32} color="#FFFFFF" style={styles.balanceIcon} />
            <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
          </View>
          <Text style={styles.balanceSubtext}>Available for rides</Text>
        </Card.Content>
      </Card>

      <Card style={styles.addMoneyCard}>
        <Card.Content>
          <Text style={styles.addMoneyTitle}>Add Money</Text>
          <View style={styles.inputContainer}>
            <Icon name="currency-inr" size={24} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              label="Amount (Rs.)"
              value={addAmount}
              onChangeText={setAddAmount}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          </View>
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
                <Icon name="wallet-outline" size={48} color="#999999" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
              </Card.Content>
            </Card>
          ) : (
            mockTransactions.map(transaction => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIconContainer, { backgroundColor: getTransactionColor(transaction.type, transaction.amount) + '20' }]}>
                      <Icon 
                        name={getTransactionIcon(transaction.type, transaction.amount)} 
                        size={20} 
                        color={getTransactionColor(transaction.type, transaction.amount)} 
                      />
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDesc}>{transaction.desc}</Text>
                      <View style={styles.transactionDateContainer}>
                        <Icon name="calendar" size={12} color="#999999" />
                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Icon 
                      name={transaction.amount > 0 ? "plus" : "minus"} 
                      size={16} 
                      color={transaction.amount > 0 ? '#34C759' : '#FF3B30'} 
                    />
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.amount > 0 ? '#34C759' : '#FF3B30' }
                    ]}>
                      Rs. {Math.abs(transaction.amount)}
                    </Text>
                  </View>
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
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    marginRight: 8,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
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
  transactionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  transactionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  transactionAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 4,
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