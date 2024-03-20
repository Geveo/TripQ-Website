import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import "./styles.scss";
import { useEffect, useState } from "react";
import {
  deinit,
  init,
  getTransactions,
  getTrustlines,
  getAccountInfo,
} from "../../services-common/evernode-xrpl-service";
import { DestinationTags, LocalStorageKeys } from "../../constants/constants";
import { useSelector } from "react-redux";
import { showPayQRWindow } from "../../services-common/xumm-api-service";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowUp, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setShowScreenLoader } from "../../features/screenLoader/ScreenLoaderSlice";
import CoinRankingService from "../../services-common/coinranking-service";


const  AccountTransactions = () => {
    const dispatch = useDispatch();
    const [accountAddress, setAccountAddress] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transactionForTable, setTransactionsForTable] = useState([]);
    const [totalEVR, setTotalEVR] = useState('0.00');
    const [totalXAHDrops, setTotalXAHDrops] = useState('0')
    const [totalEVRinUSD, setTotalEVRinUSD] = useState(0);
    const [totalXAHinUSD, setTotalXAHinUSD] = useState(0);

  const [issuer, setIssuer] = useState(process.env.REACT_APP_CURRENCY_ISSUER);
  const currency = process.env.REACT_APP_CURRENCY;

  const loginState = useSelector((state) => state.loginState);

  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("1");

  const radios = [
    { name: "All TRX", value: "1" },
    { name: "TripQ TRX", value: "2" },
  ];

  useEffect(() => {
    dispatch(setShowScreenLoader(true));
    const acc = localStorage.getItem(LocalStorageKeys.AccountAddress);
    if (acc && acc.length > 0) {
      setAccountAddress(acc);
    }

    if (accountAddress) loadTransactions();
    else {
      dispatch(setShowScreenLoader(false));
    }
  }, [accountAddress]);

    const loadTransactions =  () => {
        if(accountAddress) {
            init().then(res => {
                getTrustlines(accountAddress, process.env.REACT_APP_CURRENCY, process.env.REACT_APP_CURRENCY_ISSUER).then(res => {
                    if(res && res.length > 0) {
                        const balanceValue = res.find(ob => ob.account === process.env.REACT_APP_CURRENCY_ISSUER)?.balance;
                        const evrBalance = balanceValue ? parseFloat(balanceValue).toFixed(6) : 0.00;
                        setTotalEVR(evrBalance);
                        // CoinRankingService.getEVR2USDT(evrBalance).then(val => {
                        //     setTotalEVRinUSD(val);
                        // })
                        setTotalEVRinUSD(evrBalance * 115000);
                    }
                } ).catch(e => {throw e});

                getAccountInfo(accountAddress).then(res => {
                    if(res && res.Balance && res.Balance.length > 0){
                        setTotalXAHDrops(res.Balance);
                        // CoinRankingService.getXAH2USDT(Number(res.Balance)/1000000).then(val => {
                        //     setTotalXAHinUSD(val);
                        // })
                        setTotalXAHinUSD(res.Balance/1000000 * 23000);
                    }

                }).catch(e => {throw e});

          getTransactions(accountAddress)
            .then((res) => {
              const sortedtrx = [...res].sort((a, b) => b.tx.date - a.tx.date);
              setTransactions(sortedtrx);

              if (radioValue === "2") {
                setTransactionsForTable(
                  res
                    .filter(
                      (t) =>
                        t.tx.DestinationTag &&
                        t.tx.DestinationTag ===
                          DestinationTags.RESERVATION_PAYMENT
                    )
                    .sort((a, b) => b.tx.date - a.tx.date)
                );
              } else {
                setTransactionsForTable(sortedtrx);
              }

              dispatch(setShowScreenLoader(false));
              deinit().catch((e) => {
                throw e;
              });
            })
            .catch((e) => {
              throw e;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const toggleTransactions = (value) => {
    setRadioValue(value);
    if (value === "2") {
      setTransactionsForTable(
        transactions
          .filter(
            (t) =>
              t.tx.DestinationTag &&
              t.tx.DestinationTag === DestinationTags.RESERVATION_PAYMENT
          )
          .sort((a, b) => b.tx.date - a.tx.date)
      );
    } else {
      setTransactionsForTable([...transactions]);
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount === "string") {
      const value=parseFloat(amount / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${value} XAH`;
    } else {
      const value=parseFloat(amount.value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${value} ${amount.currency}`;
    }
  };

  const formatAndGetDate = (timestamp) => {
    const millisecondsSinceUnixEpoch = (timestamp + 946684800) * 1000;
    const dateObject = new Date(millisecondsSinceUnixEpoch);
    const formatAmountTooltip = async (amount) => {
        if(typeof amount === 'string') {
            return `${ await CoinRankingService.getXAH2USDT(amount/1000000)} LKR `
        } else {
            return `${await CoinRankingService.getXAH2USDT(amount)} LKR`
        }
    }

    const formatAndGetDate = (timestamp) => {
        const millisecondsSinceUnixEpoch = (timestamp + 946684800) * 1000;
        const dateObject = new Date(millisecondsSinceUnixEpoch);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    return `${year}-${month}-${day}`;
  };

  const formatAndGetTime = (timestamp) => {
    const millisecondsSinceUnixEpoch = (timestamp + 946684800) * 1000;
    const dateObject = new Date(millisecondsSinceUnixEpoch);

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();

    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
    const time = dateObject.toLocaleTimeString("en-US", timeOptions);

    // return `${hours}:${minutes}:${seconds}`;
    return time;
  };

  const pay = async () => {
    const result = await showPayQRWindow(
      loginState.loggedInAddress,
      `raQLbdsGp4FXtesk5BSGBayBFJv4DESuaf`,
      "6",
      DestinationTags.RESERVATION_PAYMENT,
      process.env.REACT_APP_CURRENCY,
      process.env.REACT_APP_CURRENCY_ISSUER
    );
    console.log(result);
  };

  return (
    <>
      <Container style={{ minHeight: "85vh" }}>
        <Row>
          <Col lg={10}>
            <div
              className="page-header mt-4"
              style={{
                color: "rgb(44 44 118)",
                fontWeight: 700,
                fontSize: "50px",
              }}
            >
              My Account
            </div>
            <div className="account-address">{accountAddress}</div>
          </Col>
          <Col lg={2}>
            <div className="page-header mt-5">
              <Button
                variant="warning"
                onClick={loadTransactions}
                style={{ color: "rgb(44 44 118)", fontWeight: 700 }}
              >
                Refresh <FontAwesomeIcon icon={faArrowsRotate} />
              </Button>
            </div>
          </Col>
          {/*<Col lg={2}>*/}
          {/*    <div className='page-header mt-5'>*/}
          {/*        <Button variant="warning" onClick={pay}*/}
          {/*                style={{color: 'rgb(44 44 118)', fontWeight: 700}}>Pay <FontAwesomeIcon icon={faArrowsRotate} /></Button>*/}
          {/*    </div>*/}
          {/*</Col>*/}
        </Row>

                <Row className={`mt-5`}>
                    {/*<Col lg={1}></Col>*/}
                    <Col lg={5}>
                        <Card className={`text-center p-5 balance-card`} style={{position: 'relative'}}>
                            <div style={{ position: 'absolute', left: 10, top: 5}} className={`card-label`}> EVR balance</div>
                            <Card.Body style={{ marginTop: '33px'}}>
                                <div className={`ever-balance-value`} title={`LKR ${totalEVRinUSD}`}>
                                    {totalEVR} <br /> <span style={{ fontSize: '30px', lineHeight: '12px'}}>({totalEVRinUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} LKR)</span>
                                </div>
                                {/*<div className={`font-size-10 evr-label mt-5`}>EVR.{issuer}</div>*/}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={2}></Col>
                    <Col lg={5}>
                        <Card className={`text-center p-5 balance-card`} style={{position: 'relative'}}>
                            <div style={{ position: 'absolute', left: 10, top: 5}} className={`card-label`}> XAH balance</div>
                            <Card.Body style={{marginTop: '33px'}}>
                                <div className={`ever-balance-value`} title={`LKR ${totalXAHinUSD}`}>
                                    {(parseFloat(totalXAHDrops) / 1000000).toFixed(6)} <br/> <span style={{fontSize: '30px', lineHeight: '12px'}}>({totalXAHinUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} LKR)</span>
                                </div>
                                {/*<div className={`font-size-10 evr-label mt-5`}>EVR.{issuer}</div>*/}
                            </Card.Body>
                        </Card>
                    </Col>
                    {/*<Col lg={1}></Col>*/}
                </Row>

                <Row className='mt-5 mb-2'>
                    <Col><h2 style={{ color: 'rgb(44 44 118)'}}>Transactions</h2></Col>
                </Row>
                <Row className={`mb-3`}>
                    <Col>
                        <ButtonGroup>
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={'outline-warning'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => { toggleTransactions(e.currentTarget.value);}}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    <Col>
                        <Table striped={true} bordered={true}>
                            <tbody>
                            {transactionForTable.map((trx, index) => {
                                    if(trx.validated && trx.tx.TransactionType === 'Payment') {
                                        const tx = trx.tx;
                                    
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <h5 className='mb-0'>
                                                        {tx.Account === accountAddress ? <Badge bg="danger">SENT <FontAwesomeIcon icon={faArrowUp} style={{ transform: 'rotate(45deg)'}} /> </Badge> : <Badge bg="success">RECEIVED  <FontAwesomeIcon icon={faArrowUp} style={{ transform: 'rotate(225deg)'}} /></Badge>}
                                                    </h5>
                                                </td>
                                                <td><div className='cell-texts' style={{ color: 'rgb(44 44 118)'}}>{formatAndGetDate(tx.date)}</div></td>
                                                <td><div className='cell-texts' style={{ color: 'rgb(44 44 118)'}}>{formatAndGetTime(tx.date)}</div></td>
                                                <td><div className='cell-texts' style={{ color: 'rgb(44 44 118)'}}>{ tx.Account === accountAddress ? tx.Destination : tx.Account  }</div></td>
                                                <td><div className={`cell-texts ${tx.Account === accountAddress ? 'text-red' : 'text-green'} `} >{formatAmount(tx.Amount)}</div></td>
                                            </tr>
                                        )
                                    }
                                })}          
                            </tbody>
                        </Table>
                    </Col>
                </Row>    
            </Container>
        </>
    );
};

export default AccountTransactions;
