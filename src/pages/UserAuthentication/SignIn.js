import React, { useEffect } from "react";
import { Xumm } from "xumm";
import {
  initWeb3Auth,
  //login,
  // logout,
  getUserInfo,
  getAccounts,
  getBalance,
  sendTransaction,
} from "../../services-common/web3authService";

import {
  initializeWeb3AuthConfig,
  login,
  logout,
} from "../../services-common/web3authServiceEthereum";
import { Button } from "reactstrap";

const SignIn = () => {
  useEffect(() => {
    const initializeWeb3Auth = async () => {
      try {
        await initializeWeb3AuthConfig();
        //await initWeb3Auth();
        console.log("Web3Auth initialized");
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initializeWeb3Auth();
  }, []);

  const handleLogin = async () => {
    try {
      await login().then((res) => {
        if (res) console.log("Logged in successfully");
      });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().then((res) => {
        if (res) console.log("Logged out successfully");
      });
    } catch (error) {
      console.error("Error during logged out:", error);
    }
  };

  const handleGetInfo = async () => {
    try {
      // await authenticateUser();
      await getUserInfo();
      await getAccounts();
      await getBalance();
    } catch (error) {
      console.error("Error in fetching data", error);
    }
  };

  const handleGetAccountInfo = async () => {
    try {
      await getBalance();
    } catch (error) {
      console.error("Error in fetching data", error);
    }
  };

  const handleSendTransaction = async () => {
    try {
      await sendTransaction();
    } catch (error) {
      console.error("Error in fetching data", error);
    }
  };

  return (
    <>
      {/* <div>
        <h1>Sign In</h1>
        <button onClick={handleLogin}>Login with Web3Auth</button>
      </div>
      <div>
        <h1>Logout</h1>
        <button onClick={handleLogout}>Log out with Web3Auth</button>
      </div>
      <div>
        <h1>Get Info</h1>
        <button onClick={handleGetInfo}>Get authenticated user</button>
      </div>
      <div>
        <h1>Get Account Info</h1>
        <button onClick={handleGetAccountInfo}>Get Account Info</button>
      </div>
      <div>
        <h1>Send transaction</h1>
        <button onClick={handleSendTransaction}>Send Transaction</button>
      </div> */}
{/* 
      <Card>
        <div>
          <Button className="btn-style" id="loginWithMetaMask">
            Login with MetaMask
          </Button>
        </div>
      </Card> */}
    </>
  );
};

export default SignIn;
