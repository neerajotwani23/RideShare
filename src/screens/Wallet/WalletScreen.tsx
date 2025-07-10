import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { WalletIcon, CarIcon, RefreshIcon, CalendarIcon, AddIcon } from '../../components/icons';
import { COLORS } from '../../constants/colors';

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
              <RefreshIcon size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceAmountContainer}>
            <Text style={styles.balanceCurrency}>Rs.</Text>
            <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
          </View>
          <Text style={styles.balanceSubtext}>Available for rides</Text>
        </Card.Content>
      </Card>

      <Card style={styles.addMoneyCard}>
        <Card.Content>
          <Text style={styles.addMoneyTitle}>Add Money</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputCurrency}>Rs.</Text>
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
            icon={() => <AddIcon size={18} color={COLORS.primary} />}
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
                <WalletIcon size={48} color={COLORS.textSecondary} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
              </Card.Content>
            </Card>
          ) : (
            mockTransactions.map(transaction => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIconContainer, { backgroundColor: COLORS.lightGray }]}>
                      {transaction.type === 'ride' && <CarIcon size={20} color={COLORS.textSecondary} />}
                      {transaction.type === 'topup' && <AddIcon size={20} color={COLORS.secondary} />}
                      {transaction.type === 'refund' && <RefreshIcon size={20} color={COLORS.textSecondary} />}
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDesc}>{transaction.desc}</Text>
                      <View style={styles.transactionDateContainer}>
                        <CalendarIcon size={12} color={COLORS.textSecondary} />
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmount}>
                      {transaction.amount > 0 ? '+' : '-'} Rs. {Math.abs(transaction.amount)}
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
    backgroundColor: COLORS.primary,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
  },
  balanceCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textSecondary,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceCurrency: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  addMoneyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addMoneyTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputCurrency: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textSecondary,
    marginRight: 4,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.border,
    borderRadius: 16,
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
  },
  addButtonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  transactionsSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  transactionsList: {
    // maxHeight: 220, // Remove this line to allow natural scrolling
  },
  transactionCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: COLORS.lightGray,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  transactionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  transactionAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginLeft: 4,
  },
  emptyCard: {
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.disabled,
  },
});

export default WalletScreen; 