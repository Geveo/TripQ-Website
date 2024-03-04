import RegisterHotel from "./pages/RegisterHotel";
import CustomerDashboard from "./pages/CustomerDashboard";
import './App.scss'
import {Route, Routes} from "react-router-dom";
import ContractService from "./services-common/contract-service";
import HotelHomePage from "./pages/HotelHomePage";
import LandingPageForHotelOwner from "./pages/LandingPageForHotelOwner";
import LandingPageForCustomer from "./pages/LandingPageForCustomer";
import RegisterCustomer from "./pages/RegisterCustomer";
import HotelSearchPage from "./pages/HotelSearchPage";
import Reservations from "./pages/Reservations";
import ConfirmBooking from "./pages/ConfirmBooking";
import AvailabilityPage from "./pages/AvailabilityPage";
import { useEffect, useState } from "react";
import { Spinner } from 'reactstrap';
import ScanQRCode from "./pages/ScanQRCode";
import HotelsList from "./pages/HotelsList/HotelsList";
import AccountTransactions from "./pages/AccountTransactions/AccountTransactions";
import {useDispatch, useSelector} from 'react-redux';
import { loginSuccessfully } from "./features/LoginState/LoginStateSlice";

function App() {

    const dispatch = useDispatch();
    const loginState = useSelector((state) => state.loginState);

    const [isContractInitiated, setIsContractInitiated] = useState(false);

    useEffect(() => {
        ContractService.instance.init().then(res => {
            setIsContractInitiated(true);
        });

        const acc = localStorage.getItem('Account');
        if(acc && acc.length > 0) {
            dispatch(loginSuccessfully(acc));
        }

        const handleBackButton = () => {
            // Do something when the back button is clicked
            ContractService.instance.init().then(res => {
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
            {isContractInitiated && (
                <Routes>
                    <Route path="/" element={<CustomerDashboard />} />
                    <Route path="/list-property" element={<LandingPageForHotelOwner />} exact />
                    <Route path="/register-hotel" element={<RegisterHotel />} exact />
                    <Route path="/register-customer" element={<RegisterCustomer />} exact />
                    <Route path="/hotel/:id" element={<HotelHomePage />} exact />
                    <Route path="/reservations" element={<Reservations />} exact />
                    <Route path="/search-hotel" element={<HotelSearchPage exact />} />
                    <Route path="/confirm-booking" element={<ConfirmBooking exact />} />
                    <Route path="/availability/:id" element={<AvailabilityPage/>} exact />
                    <Route path="/scan-qr-code" element={<ScanQRCode />} exact />
                    <Route path="/hotel-list" element={<HotelsList />} exact />
                    {loginState.isLoggedIn && (
                        <Route path="/my-transactions" element={<AccountTransactions />} exact />
                    )}
                    <Route path="*" element={<CustomerDashboard />} />
                    
                </Routes>
            )}
            {!isContractInitiated && (
                <div className="spinnerWrapper">
                    <Spinner
                        color="primary"
                        style={{
                            height: "3rem",
                            width: "3rem",
                        }}
                        type="grow"
                    >
                        Loading...
                    </Spinner>
                </div>
            )}
        </>
    );
}

export default App;
