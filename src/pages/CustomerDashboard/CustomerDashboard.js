import React, { useState, useEffect } from "react";
import { Col, Container, Row, Input, Button } from "reactstrap";
import "./customer_dashboard_styles.scss";
import { RangeDatePicker } from "@y0c/react-datepicker";
import "@y0c/react-datepicker/assets/styles/calendar.scss";
import OfferCard from "../../components/OfferCard/OfferCard";
import { useNavigate } from "react-router-dom";
import topRatedHotels from "../../data/topRatedHotels";
import properties from "../../data/properties";
import TopHotelCard from "../../components/TopHotelCard";
import Ellipse from "../../Assets/Icons/ellipse.svg";
import ExploreCard from "../../components/ExploreCard";
import QuickPlanner from "../../components/QuickPlanner";
import searches from "../../data/searches";
import SearchCard from "../../components/SearchCard";
import SearchMenu from "../../components/SearchMenu";
import bestOffers from "../../data/bestOffers";
import toast from "react-hot-toast";
import ToastInnerElement from "../../components/ToastInnerElement/ToastInnerElement";
import HotelService from "../../services-domain/hotel-service copy";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpeechService from "../../services-common/speech-service";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { AzureOpenaiService } from "../../services-common/azure-openai-service";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { useDispatch } from "react-redux";
import { setAiHotelSearchResults } from "../../redux/AiHotelSearchState/AiHotelSearchStateSlice";
import { setMoreAiSearchResults } from "../../redux/AiHotelSearchState/MoreAiSearchStateSlice";
import { LocalStorageKeys } from "../../constants/constants";

function CustomerDashboard() {
  const navigate = useNavigate();
  const openAiService = AzureOpenaiService.getInstance();
  const dispatch = useDispatch();

  const hotelService = HotelService.instance;
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [city, setCity] = useState("");
  const [peopleCount, setPeopleCount] = useState(0);
  const [recentHotels, setRecentHotel] = useState([]);
  const [errorMessage, setErrorMessge] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const speechService = new SpeechService();
  const onDateChange = (...args) => {
    setDateRange(args);
  };

  useEffect(() => {
    let hotelList = [];
    hotelService.getRecentHotels().then((data) => {
      data.forEach((element) => {
        let hotel = {
          name: element.Name,
          location: JSON.parse(element.Location).City,
          image: element.ImageURL,
          price: element.Price,
          rating: element.StarRatings,
          ratingCount: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
        };
        hotelList.push(hotel);
      });
      setRecentHotel(hotelList);
    });
  }, []);

  function onSearchSubmit() {
    setLoading(true);
    const promises = [openAiService.searchHotels(searchText)];

    Promise.all(promises)
      .then(([searchResult]) => {
        setLoading(false);
        if (searchResult.hotels.length > 0) {
          dispatch(setAiHotelSearchResults(searchResult));
          localStorage.setItem(
            LocalStorageKeys.AiHotelSearchResult,
            JSON.stringify(searchResult)
          );
          navigate(`/search-hotel`);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error occurred:", error);
      });
  }

  function loadMoreHotels() {
    const promises = [openAiService.searchHotels(searchText, 25)];

    Promise.all(promises)
      .then(([searchResult]) => {
        setLoading(false);
        if (searchResult.hotels.length > 0) {
          dispatch(setMoreAiSearchResults(searchResult.hotels));
          localStorage.setItem(
            LocalStorageKeys.MoreAiHotelSearchResult,
            JSON.stringify(searchResult.hotels)
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error occurred:", error);
      });
  }

  async function handleSpeechToTextFromMic() {
    setSearchText("");
    setIsListening(true);
    speechService
      .speechToTextFromMic()
      .then((displayText) => {
        setSearchText(displayText);
        setIsListening(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsListening(false);
      });
  }

  return (
    <>
      <LoadingScreen showLoadPopup={loading} />
      <div className="main-image-div">
        <Container className="main-txt">
          <h3>
            Discover your next holiday by using our AI powered search engine
          </h3>
          <p>Simply type in your requirements and we will do the rest</p>
        </Container>
      </div>
      <Container>
        <div className="search_section">
          <div className="tab-area">
            <SearchMenu />
          </div>
          <div className="search-area">
            <div>
              <Row>
                <Col>
                  <div className="container">
                    <div className="icon-and-text">
                      <FontAwesomeIcon
                        icon={faArrowAltCircleDown}
                        className="fa-fade"
                        size="lg"
                      />
                      <div className="search-area-phrase">
                        Eg-: I want to take my family(four) to a beach resort in
                        Asia from the 1st December to the 31st December 2024. We
                        are also interested in trekking.
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ justifyContent: "center" }}>
                <Col>
                  <InputGroup className="">
                    <Button
                      variant="outline-secondary"
                      id="button-addon1"
                      className={
                        isListening
                          ? `microphone-icon-isListening`
                          : `microphone-icon`
                      }
                      onClick={handleSpeechToTextFromMic}
                      title="Speak freely in your native tongue. Remember to include your preferences, check-in and check-out dates, and the number of guests while you talk."
                    >
                      <FontAwesomeIcon
                        size="lg"
                        icon={faMicrophone}
                        className="fa fa-microphone"
                      />
                    </Button>
                    <textarea
                      placeholder="Search your next stay here..."
                      aria-label="Search your next stay here..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      rows={4} // Set the number of rows for the textarea
                      cols={125} // Set the number of columns for the textarea
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button
                    className="overrideSearchButton"
                    onClick={onSearchSubmit}
                    disabled={searchText.length == 0}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
              {isListening ? (
                <div className="listening">Listening..</div>
              ) : null}
            </div>
          </div>
        </div>
        <section>
          <div className="top_rated_hotels">
            <h2 className="best_offers">Explore New Hotels!</h2>
            <div className="hotel_items_flexbox">
              {recentHotels.slice(0, 8).map((recentHotel, index) => (
                <div className="hotel_card" key={index}>
                  <TopHotelCard hotel={recentHotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="best_offers">
          <div className="best_offers">
            <h1 style={{ margin: 0 }}>Best Offers</h1>
            <p className="titleParagraph">
              Promotions, deals and special offers for you
            </p>
            <div className="offer_items_flexbox">
              {bestOffers.slice(0, 3).map((offer, index) => (
                <OfferCard key={index} offer={offer} />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="top_rated_hotels">
            <h1 className="headline">Top Rated in Sri Lanka</h1>
            <div className="hotel_items_flexbox">
              {topRatedHotels.slice(0, 8).map((topRatedHotel, index) => (
                <div className="hotel_card" key={index}>
                  <TopHotelCard hotel={topRatedHotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="explore">
          <div className="row ">
            <div className="col-3 exploreTitle">
              <div className="row-9 title">
                Explore
                <br />
                Sri Lanka
              </div>
              <div className="row-3">
                {" "}
                <Button className="secondaryButton exploreBtn">
                  Explore more
                </Button>
              </div>
            </div>
            <div className="col-9 exploreCards">
              <div className="row ">
                <div className="col-1 ellipse">
                  <img src={Ellipse} alt="" />
                </div>
                <div className="col-10">
                  <div className="row">
                    {properties.slice(0, 3).map((property, index) => (
                      <div className="col-md-4 explorecd" key={index}>
                        <ExploreCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-1 ellipse">
                  <img src={Ellipse} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="planner">
            <h1 className="headline">Easy & Quick Planner</h1>
            <div className="row">
              <div className="col-9"></div>
              <div className="col-3 searchDestination">
                <Input
                  placeholder="Search your destination"
                  className="input"
                ></Input>
              </div>
            </div>

            <QuickPlanner className="quickPlanner" />
          </div>
        </section>
        <section className="connect">
          <div className=" wrapper">
            <div className="row">
              <div className="col-6">
                <div className="row-4">
                  <h1 className="connectTitle">
                    Connect with <br />
                    other travellers
                  </h1>
                </div>
                <div className="row-4">
                  <p className="connectDesc">
                    The Pearl of the Indian Ocean’ or the ‘teardrop of India’.
                    Sri Lanka has many names – and they all encompass its
                    beauty. Make the birthplace of cinnamon your next
                    destination with advice from other travellers.
                  </p>
                </div>
                <div className="row-4">
                  <div className="connectButton">
                    <Button className="connectButtonInside">View more</Button>
                  </div>
                </div>
              </div>
              <div className="col-6"></div>
            </div>
          </div>
        </section>
        <section className="recent_searches">
          <h1 className="headline">Your recent Searches</h1>
          <div className="row">
            {searches.slice(0, 3).map((search, index) => (
              <div className="col-md-4 explorecd" key={index}>
                <SearchCard search={search} />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

export default CustomerDashboard;
