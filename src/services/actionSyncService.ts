import { dataSyncService } from './dataSyncService';
import { api } from './api';

interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

class ActionSyncService {
  private pendingActions: Array<() => Promise<void>> = [];
  private isProcessing = false;

  /**
   * Execute an action and ensure it's committed to the database
   */
  async executeAction<T>(
    action: () => Promise<T>,
    syncAfterAction: boolean = true
  ): Promise<ActionResult> {
    try {
      console.log('🔄 Executing action...');
      
      // Execute the action
      const result = await action();
      
      // If sync is requested, refresh data from database
      if (syncAfterAction) {
        await this.syncAfterAction();
      }
      
      console.log('✅ Action executed successfully');
      return { success: true, data: result };
    } catch (error: any) {
      console.error('❌ Action failed:', error);
      return { 
        success: false, 
        error: error.message || 'Action failed' 
      };
    }
  }

  /**
   * Sync data after an action is completed
   */
  private async syncAfterAction(): Promise<void> {
    try {
      console.log('🔄 Syncing data after action...');
      await dataSyncService.syncAllData();
      console.log('✅ Data synced after action');
    } catch (error) {
      console.error('❌ Failed to sync after action:', error);
    }
  }

  /**
   * Queue an action for later execution
   */
  queueAction(action: () => Promise<void>): void {
    this.pendingActions.push(action);
    this.processQueue();
  }

  /**
   * Process queued actions
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.pendingActions.length === 0) {
      return;
    }

    this.isProcessing = true;
    try {
      while (this.pendingActions.length > 0) {
        const action = this.pendingActions.shift();
        if (action) {
          await action();
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Predefined action templates for common operations

  /**
   * Create a ride and sync data
   */
  async createRide(rideData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.createRide(rideData);
      return result;
    });
  }

  /**
   * Update a ride and sync data
   */
  async updateRide(rideId: number, rideData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.updateRide(rideId, rideData);
      return result;
    });
  }

  /**
   * Cancel a ride and sync data
   */
  async cancelRide(rideId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.cancelRide(rideId);
      return result;
    });
  }

  /**
   * Create a ride request and sync data
   */
  async createRideRequest(requestData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.createRideRequest(requestData);
      return result;
    });
  }

  /**
   * Accept a ride request and sync data
   */
  async acceptRideRequest(requestId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.acceptRideRequest(requestId);
      return result;
    });
  }

  /**
   * Reject a ride request and sync data
   */
  async rejectRideRequest(requestId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.rejectRideRequest(requestId);
      return result;
    });
  }

  /**
   * Add money to wallet and sync data
   */
  async addMoneyToWallet(amount: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.addMoneyToWallet(amount);
      return result;
    });
  }

  /**
   * Update user profile and sync data
   */
  async updateProfile(profileData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.updateProfile(profileData);
      return result;
    });
  }

  /**
   * Create a rating and sync data
   */
  async createRating(ratingData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.createRating(ratingData);
      return result;
    });
  }

  /**
   * Create a vehicle and sync data
   */
  async createVehicle(vehicleData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.createVehicle(vehicleData);
      return result;
    });
  }

  /**
   * Update a vehicle and sync data
   */
  async updateVehicle(vehicleId: number, vehicleData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.updateVehicle(vehicleId, vehicleData);
      return result;
    });
  }

  /**
   * Delete a vehicle and sync data
   */
  async deleteVehicle(vehicleId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.deleteVehicle(vehicleId);
      return result;
    });
  }

  /**
   * Change password and sync data
   */
  async changePassword(passwordData: any): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.changePassword(passwordData);
      return result;
    });
  }



  /**
   * Complete a ride and sync data
   */
  async completeRide(rideId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.completeRide(rideId);
      return result;
    });
  }

  /**
   * Activate a ride and sync data
   */
  async activateRide(rideId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.activateRide(rideId);
      return result;
    });
  }

  /**
   * Confirm a ride and sync data
   */
  async confirmRide(rideId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.confirmRide(rideId);
      return result;
    });
  }

  /**
   * Complete a ride request and sync data
   */
  async completeRideRequest(requestId: number): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await api.completeRideRequest(requestId);
      return result;
    });
  }

  /**
   * Force sync all data (useful for manual refresh)
   */
  async forceSync(): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await dataSyncService.syncAllData();
      return result;
    }, false); // Don't sync again after this action
  }

  /**
   * Sync specific data type
   */
  async syncSpecificData(dataType: string): Promise<ActionResult> {
    return this.executeAction(async () => {
      const result = await dataSyncService.syncSpecificData(dataType as any);
      return result;
    }, false); // Don't sync again after this action
  }
}

export const actionSyncService = new ActionSyncService();
export default actionSyncService; 