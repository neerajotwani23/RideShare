import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { WalletIcon, CarIcon, RefreshIcon, CalendarIcon, AddIcon } from '../../components/icons';
import { COLORS } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useOptimizedNavigationSync } from '../../hooks/useOptimizedNavigationSync';
import { StripeProvider,usePaymentSheet } from '@stripe/stripe-react-native';

import { Stripe_PublishableKey,ENV_CONFIG } from '../../config/env';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WalletScreen = () => {
  // Navigation sync hook
  useOptimizedNavigationSync();
  const [ready, setReady] = useState(true);
  const [stripe_id, setStripeId] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet,loading } = usePaymentSheet();
 
// ...existing code...
const fetchStripeConfig = async () => {
  try {
    const response = await axios.post(`${ENV_CONFIG.API_BASE_URL}/stripe/initiate`, null, {
      params: {
        amount: Number(addAmount) * 100, // Convert to cents for Stripe
        currency: 'usd'
      }
    });
    
    // Return the data from the response
    return response.data;
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    Alert.alert('Error', 'Failed to initialize payment. Please try again.');
    throw error;
  }
};
 const Resord_Transaction = async (type:string,amount:string,stripe_id:string | null,user_id:string,ride_id= null) => {
      try{
        const Token = await AsyncStorage.getItem('accessToken');
        await axios.post(`${ENV_CONFIG.API_BASE_URL}/transactions/stripe`,{
          type,
          amount,
          stripe_id,
          user_id,
          ride_id
        },{
          headers:{
            Authorization: `Bearer ${Token}`
          }
        })
      }catch (error){
        Alert.alert('Error', 'Failed to record transaction. Please try again later.');
      }

    }
  const initializePaymentSheet = async () => {
    try {
      setIsPaymentLoading(true);
      const {paymentIntent, ephemeralKey, customer} = await fetchStripeConfig();
      setStripeId(customer);
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        merchantDisplayName: 'RideShare',
        allowsDelayedPaymentMethods: true,
        returnURL: 'stripe-example://stripe-redirect',
      });
      if (error){
        Alert.alert(`Error Code: ${error.code}, Message: ${error.message}`);
        setIsPaymentLoading(false);
        return false;
      }else{
      
        setReady(true);
        setIsPaymentLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Payment sheet initialization error:', error);
      setIsPaymentLoading(false);
      return false;
    }
  };

  
  const [addAmount, setAddAmount] = useState('');
  const { 
    walletBalance,
    userProfile, 
    transactions, 
    addMoneyToWallet, 
    refreshWalletBalance, 
    refreshTransactions,
    isLoading,
    isRefreshing 
  } = useApp();

  useEffect(() => {
    refreshWalletBalance();
    refreshTransactions();
  }, []);

  const handleAdd = async () => {
    // Validation
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    try {
      // Initialize payment sheet first
      const isInitialized = await initializePaymentSheet();
      
      if (!isInitialized) {
        return; // Error already shown in initializePaymentSheet
      }

      // Present payment sheet
      const {error} = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error Code: ${error.code}, Message: ${error.message}`);
      } else {
        Alert.alert('Success', 'Payment successful! Money added to your wallet.');
        
        Resord_Transaction('credit',addAmount,stripe_id,userProfile.id);
        setAddAmount('');
        setReady(false);
        refreshWalletBalance();
        refreshTransactions();
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return <CarIcon size={24} color={COLORS.error} />;
      case 'topup':
        return <AddIcon size={24} color={COLORS.success} />;
      case 'refund':
        return <RefreshIcon size={24} color={COLORS.accent} />;
      default:
        return <WalletIcon size={24} color={COLORS.textSecondary} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'ride':
        return COLORS.error;
      case 'topup':
        return COLORS.success;
      case 'refund':
        return COLORS.accent;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => {
              refreshWalletBalance();
              refreshTransactions();
            }}
            disabled={isRefreshing}
          >
            <RefreshIcon size={24} color={COLORS.accent} />
          </TouchableOpacity>
      </View>

        {/* Balance Card */}
      <Card style={styles.balanceCard}>
        <Card.Content style={styles.balanceContent}>
          <View style={styles.balanceHeader}>
              <WalletIcon size={32} color={COLORS.accent} />
              <Text style={styles.balanceTitle}>Current Balance</Text>
          </View>
            <Text style={styles.balanceAmount}>
              Rs. {walletBalance.toFixed(2)}
            </Text>
            {isRefreshing && (
              <ActivityIndicator size="small" color={COLORS.accent} style={styles.refreshIndicator} />
            )}
        </Card.Content>
      </Card>

        {/* Add Money Section */}

      <Card style={styles.addMoneyCard}>
          <Card.Content style={styles.addMoneyContent}>
            <Text style={styles.sectionTitle}>Add Money</Text>
            <View style={styles.addMoneyRow}>
          <TextInput
                style={styles.amountInput}
                mode="outlined"
            label="Amount (Rs.)"
            value={addAmount}
            onChangeText={setAddAmount}
            keyboardType="numeric"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.accent}
                theme={{ roundness: 12 }}
          />
         <StripeProvider publishableKey={Stripe_PublishableKey}> 
          <Button 
            mode="contained" 
            onPress={handleAdd} 
            style={styles.addButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                
                loading={isPaymentLoading}
          >
                {isPaymentLoading ? 'Initializing...' : 'Add'}
          </Button>
          </StripeProvider>
            </View>
        </Card.Content>
      </Card>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddContainer}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddButtons}>
            {[100, 200, 500, 1000].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => setAddAmount(amount.toString())}
              >
                <Text style={styles.quickAddText}>Rs. {amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.accent} style={styles.loadingIndicator} />
          ) : transactions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <WalletIcon size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
              </Card.Content>
            </Card>
          ) : (
            transactions.map((transaction, index) => (
              <Card key={transaction.id || index} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    {getTransactionIcon(transaction.type)}
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDesc}>{transaction.description}</Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.datetime)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(transaction.type) }
                    ]}>
                      {transaction.amount > 0 ? '+' : ''}Rs. {transaction.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.transactionType}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
        </ScrollView>

      {/* Loading Overlay for Payment Initialization */}
      {isPaymentLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Initializing Payment...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we prepare your payment</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
  },
  refreshButton: {
    padding: 8,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  refreshIndicator: {
    marginTop: 8,
  },
  addMoneyCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addMoneyContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  addMoneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountInput: {
    flex: 1,
    marginRight: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  quickAddContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    gap: 8,
  },
  quickAddButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    flex: 1,
    alignItems: 'center',
  },
  quickAddText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  transactionsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  loadingIndicator: {
    marginTop: 20,
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
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default WalletScreen; 