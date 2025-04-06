/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal"
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter"
import RPC from '@/lib/ethersRPC'

// Chain and Auth Configuration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"
const chainId = "0x142d" // Bahamut Mainnet (5165 in decimal)

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: chainId, 
  rpcTarget: "https://rpc1.bahamut.io",
  displayName: "Bahamut Mainnet",
  blockExplorerUrl: "https://ftnscan.com/",
  ticker: "FTN",
  tickerName: "Bahamut",
  logo: "https://horizon.ftnscan.com/images/logo.png",
}

// Types for our context
type UserInfo = {
  email?: string;
  name?: string;
  profileImage?: string;
  aggregateVerifier?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
  dappShare?: string;
  idToken?: string;
  oAuthIdToken?: string;
  oAuthAccessToken?: string;
};

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<UserInfo>;
  getAccounts: () => Promise<string>;
  getBalance: () => Promise<string>;
  signMessage: () => Promise<string>;
  sendTransaction: () => Promise<any>;
}

// Create the context with a default value
const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

// Provider component
export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        // SDK Initialization
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3AuthOptions: Web3AuthOptions = {
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        };

        const web3authInstance = new Web3Auth(web3AuthOptions);
        
        // Configure External Wallets
        const adapters = getDefaultExternalAdapters({ options: web3AuthOptions });
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3authInstance.configureAdapter(adapter);
        });

        setWeb3auth(web3authInstance);
        
        await web3authInstance.initModal();
        setProvider(web3authInstance.provider);

        if (web3authInstance.connected) {
          setIsLoggedIn(true);
          // Fetch user info if already connected
          const user = await web3authInstance.getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  // Authentication functions
  const login = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      
      if (web3auth.connected) {
        setIsLoggedIn(true);
        const user = await web3auth.getUserInfo();
        setUserInfo(user);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    
    try {
      await web3auth.logout();
      setProvider(null);
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getUserInfo = async (): Promise<UserInfo> => {
    if (!web3auth) {
      throw new Error("Web3Auth not initialized");
    }
    
    const user = await web3auth.getUserInfo();
    setUserInfo(user);
    return user;
  };

  // Blockchain functions
  const getAccounts = async (): Promise<string> => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    return await RPC.getAccounts(provider);
  };

  const getBalance = async (): Promise<string> => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    return await RPC.getBalance(provider);
  };

  const signMessage = async (): Promise<string> => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    return await RPC.signMessage(provider);
  };

  const sendTransaction = async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    return await RPC.sendTransaction(provider);
  };

  // The context value that will be provided to consumers
  const contextValue: Web3AuthContextType = {
    web3auth,
    provider,
    isLoading,
    isLoggedIn,
    userInfo,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};

// Custom hook to use the Web3Auth context
export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};