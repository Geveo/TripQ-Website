import RegisterHotel from "./pages/RegisterHotel";
import CustomerDashboard from "./pages/CustomerDashboard";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import ContractService from "./services-common/contract-service";
import HotelHomePage from "./pages/HotelHomePage";
import LandingPageForHotelOwner from "./pages/LandingPageForHotelOwner";
import RegisterCustomer from "./pages/RegisterCustomer";
import HotelSearchPage from "./pages/HotelSearchPage";
import Reservations from "./pages/Reservations";
import ConfirmBooking from "./pages/ConfirmBooking";
import AvailabilityPage from "./pages/AvailabilityPage";
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import ScanQRCode from "./pages/ScanQRCode";
import HotelsList from "./pages/HotelsList/HotelsList";
import AccountTransactions from "./pages/AccountTransactions/AccountTransactions";
import { useSelector } from "react-redux";
import { LocalStorageKeys } from "./constants/constants";
import { xummAuthorize } from "./services-common/xumm-api-service";
import { loginSuccessfully } from "./features/LoginState/LoginStateSlice";
import MakeReservations from "./pages/MakeReservations/MakeReservations";
import CustomerDetails from "./pages/MakeReservations/CustomerDetails";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  const loginState = useSelector((state) => state.loginState);
  const showLoadPopup = useSelector((state) => state.screenLaoder.value);
  const [isContractInitiated, setIsContractInitiated] = useState(false);

  useEffect(() => {
    ContractService.instance.init().then((res) => {
      setIsContractInitiated(true);
    });

    const acc = localStorage.getItem(LocalStorageKeys.AccountAddress);
    const pk = localStorage.getItem(LocalStorageKeys.pkce_state);
    const xpk = localStorage.getItem(LocalStorageKeys.XummPkceJwt);

    if (acc && acc.length > 0 && pk && pk.length > 0 && xpk && xpk.length > 0) {
      xummAuthorize();
      // dispatch(loginSuccessfully(acc));
    }

    const handleBackButton = () => {
      // Do something when the back button is clicked
      ContractService.instance.init().then((res) => {
        setIsContractInitiated(true);
      });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <>
      {showLoadPopup && <LoadingScreen showLoadPopup={showLoadPopup} />}
      {isContractInitiated && (
        <Routes>
          <Route path="/" element={<CustomerDashboard />} />
          <Route
            path="/list-property"
            element={<LandingPageForHotelOwner />}
            exact
          />
          <Route
            path="/register-customer"
            element={<RegisterCustomer />}
            exact
          />
          <Route path="/hotel/:id" element={<HotelHomePage />} exact />
          <Route path="/reservations" element={<Reservations />} exact />
          <Route path="/search-hotel" element={<HotelSearchPage exact />} />
          <Route path="/confirm-booking" element={<ConfirmBooking exact />} />
          <Route
            path="/availability/:id"
            element={<AvailabilityPage />}
            exact
          />
          <Route path="/scan-qr-code" element={<ScanQRCode />} exact />
          <Route path="/hotel-list" element={<HotelsList />} exact />
          <Route
            path="/make-reservations"
            element={<MakeReservations />}
            exact
          />
          <Route path="/customer-details" element={<CustomerDetails />} exact />
          {loginState.isLoggedIn && (
            <>
              <Route
                path="/my-transactions"
                element={<AccountTransactions />}
                exact
              />
              <Route path="/hotel-list" element={<HotelsList />} exact />
              <Route path="/register-hotel" element={<RegisterHotel />} exact />
            </>
          )}
          <Route path="*" element={<CustomerDashboard />} />
        </Routes>
      )}
    </>
  );
}

export default App;
