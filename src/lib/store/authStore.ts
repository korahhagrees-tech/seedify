/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Zustand store for authentication and wallet state management
 * Centralized state for user, wallets, and linked accounts
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, ConnectedWallet } from '@privy-io/react-auth';

export interface LinkedAccount {
  type: string;
  address?: string;
  email?: string;
  username?: string | null;
  subject?: string;
  // Add other account-specific fields as needed
  [key: string]: any;
}

export interface AuthState {
  // Privy user object
  user: User | null;
  
  // All connected wallets from useWallets()
  wallets: ConnectedWallet[];
  
  // Currently active/selected wallet
  activeWallet: ConnectedWallet | null;
  
  // All linked accounts from user.linkedAccounts
  linkedAccounts: LinkedAccount[];
  
  // Privy ready state
  ready: boolean;
  
  // Authentication state
  authenticated: boolean;
  
  // Derived wallet address (for backward compatibility)
  walletAddress: string | null;
}

export interface AuthActions {
  // Set user and update derived state
  setUser: (user: User | null) => void;
  
  // Set wallets array
  setWallets: (wallets: ConnectedWallet[]) => void;
  
  // Set active wallet
  setActiveWallet: (wallet: ConnectedWallet | null) => void;
  
  // Set ready state
  setReady: (ready: boolean) => void;
  
  // Set authenticated state
  setAuthenticated: (authenticated: boolean) => void;
  
  // Update linked accounts from user object
  updateLinkedAccounts: () => void;
  
  // Get wallet by address
  getWalletByAddress: (address: string) => ConnectedWallet | undefined;
  
  // Get all wallet addresses
  getAllWalletAddresses: () => string[];
  
  // Reset store (on logout)
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  wallets: [],
  activeWallet: null,
  linkedAccounts: [],
  ready: false,
  authenticated: false,
  walletAddress: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ user, authenticated: !!user }, false, 'setUser');
        
        // Auto-update linked accounts when user changes
        if (user) {
          get().updateLinkedAccounts();
        }
      },

      setWallets: (wallets) => {
        set({ wallets }, false, 'setWallets');
        
        // If we have wallets but no active wallet, set the first one
        if (wallets.length > 0 && !get().activeWallet) {
          set({ activeWallet: wallets[0], walletAddress: wallets[0].address }, false, 'setWallets:autoSetActive');
        }
      },

      setActiveWallet: (wallet) => {
        set(
          {
            activeWallet: wallet,
            walletAddress: wallet?.address || null,
          },
          false,
          'setActiveWallet'
        );
      },

      setReady: (ready) => {
        set({ ready }, false, 'setReady');
      },

      setAuthenticated: (authenticated) => {
        set({ authenticated }, false, 'setAuthenticated');
      },

      updateLinkedAccounts: () => {
        const { user } = get();
        if (!user) {
          set({ linkedAccounts: [] }, false, 'updateLinkedAccounts:noUser');
          return;
        }

        // Extract all linked accounts from user.linkedAccounts
        const accounts = (user.linkedAccounts || []) as LinkedAccount[];
        
        set({ linkedAccounts: accounts }, false, 'updateLinkedAccounts');
      },

      getWalletByAddress: (address) => {
        const { wallets } = get();
        return wallets.find(
          (wallet) => wallet.address.toLowerCase() === address.toLowerCase()
        );
      },

      getAllWalletAddresses: () => {
        const { wallets } = get();
        return wallets.map((wallet) => wallet.address);
      },

      reset: () => {
        set(initialState, false, 'reset');
      },
    }),
    { name: 'AuthStore' }
  )
);

// Selectors for common use cases
export const selectUser = (state: AuthState & AuthActions) => state.user;
export const selectWallets = (state: AuthState & AuthActions) => state.wallets;
export const selectActiveWallet = (state: AuthState & AuthActions) => state.activeWallet;
export const selectWalletAddress = (state: AuthState & AuthActions) => state.walletAddress;
export const selectLinkedAccounts = (state: AuthState & AuthActions) => state.linkedAccounts;
export const selectAuthenticated = (state: AuthState & AuthActions) => state.authenticated;
export const selectReady = (state: AuthState & AuthActions) => state.ready;

// Get all wallet accounts from linked accounts
export const selectWalletAccounts = (state: AuthState & AuthActions) =>
  state.linkedAccounts.filter((account) => account.type === 'wallet');

// Get all social accounts from linked accounts
export const selectSocialAccounts = (state: AuthState & AuthActions) =>
  state.linkedAccounts.filter((account) =>
    ['google_oauth', 'twitter_oauth', 'discord_oauth', 'github_oauth', 'apple_oauth'].includes(
      account.type
    )
  );

// Get email account
export const selectEmailAccount = (state: AuthState & AuthActions) =>
  state.linkedAccounts.find((account) => account.type === 'email');

// Get phone account
export const selectPhoneAccount = (state: AuthState & AuthActions) =>
  state.linkedAccounts.find((account) => account.type === 'phone');

