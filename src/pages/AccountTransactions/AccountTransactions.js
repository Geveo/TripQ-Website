import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import './styles.scss';
import { useEffect, useState } from 'react';
import {deinit, init, getTransactions} from './../../services-common/evernode-xrpl-service'

const  AccountTransactions = () => {
    
    const [accountAddress, setAccountAddress] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const acc = localStorage.getItem("Account");
        if(acc && acc.length > 0) {
            setAccountAddress(acc);
        }

        if(accountAddress)
            loadTransactions();
    }, [accountAddress]);

    const loadTransactions =  () => {
        if(accountAddress) {
            init().then(res => {
                getTransactions(accountAddress).then(res => {
                    const sortedtrx = [...res].sort((a, b) => b.tx.date - a.tx.date);
                    setTransactions(sortedtrx);
                    deinit().catch(e => {throw e});
                }).catch(e => {throw e})
            }).catch(error => {
                console.log(error)
            })
        }
    }


    const formatAmount = (amount) => {
        if(typeof amount === 'string') {
            return `${amount/1000000} XAH`
        } else {
            return `${amount.value} ${amount.currency}`
        }
    }

    const formatAndGetDate = (timestamp) => {
        const millisecondsSinceUnixEpoch = (timestamp + 946684800) * 1000;
        const dateObject = new Date(millisecondsSinceUnixEpoch);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();

        return `${year}-${month}-${day}`;
    }

    const formatAndGetTime = (timestamp) => {
        const millisecondsSinceUnixEpoch = (timestamp + 946684800) * 1000;
        const dateObject = new Date(millisecondsSinceUnixEpoch);

        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();

        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const time = dateObject.toLocaleTimeString('en-US', timeOptions);

        // return `${hours}:${minutes}:${seconds}`;
        return time;
    }

    
    return (
        <>
            <Container style={{minHeight: '85vh'}}>
                <Row>
                    <Col lg={10}>
                        <div className='page-header mt-4'>
                            My Transactions: <span className='account-address'>&nbsp;{accountAddress}&nbsp;</span>
                        </div>
                    </Col>
                    <Col lg={2}>
                        <div className='page-header mt-4'>
                            <Button variant="warning" onClick={loadTransactions} style={{ color: 'white', fontWeight: 700}}>Refresh</Button>
                        </div>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col>
                        <Table >
                            <tbody>
                                {transactions.map((trx, index) => {
                                    if(trx.validated && trx.tx.TransactionType === 'Payment') {
                                        const tx = trx.tx;
                                    
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <h5 className='mb-0'>
                                                        {tx.Account === accountAddress ? <Badge bg="danger">SENT</Badge> : <Badge bg="success">RECEIVED</Badge>}
                                                    </h5>
                                                </td>
                                                <td><div className='cell-texts'>{formatAndGetDate(tx.date)}</div></td>
                                                <td><div className='cell-texts'>{formatAndGetTime(tx.date)}</div></td>
                                                <td><div className='cell-texts'>{ tx.Account === accountAddress ? tx.Destination : tx.Account  }</div></td>
                                                <td><div className={`cell-texts ${tx.Account === accountAddress ? 'text-red' : 'text-green'} `}>{formatAmount(tx.Amount)}</div></td>
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