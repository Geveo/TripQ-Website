import React, { useEffect } from "react";
import { initWeb3Auth, login, logout, authenticateUser, getUserInfo, getAccounts,getBalance} from "../../services-common/web3authService";

const SignIn = () => {
  useEffect(() => {
    const initializeWeb3Auth = async () => {
      try {
        await initWeb3Auth();
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
        if(res)
          console.log("Logged in successfully");
      });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logged out:", error);
    }
  };

  const handleGetInfo = async () => {
    try {
      await authenticateUser();
      await getUserInfo();
      await getAccounts();
      await getBalance();
    } catch (error) {
      console.error("Error in fetching data", error);
    }
  };

  return (
    <>
      <div>
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
    </>
  );
};

export default SignIn;
