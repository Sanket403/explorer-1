import React, { Component } from 'react';
import './Transaction.css'
import { Link } from 'react-router-dom';
import Images from '../Images/Images';
import { Col, Button, Container, Row } from 'react-bootstrap';
import Header from '../../Components/Header/Header';
import Navbar from '../../Components/Navbar/Navbar';
import Apis from '../../lib/apis';
import AddressLink from '../../Components/AddressLink/AddressLink';
import * as moment from 'moment';
import CustomPagination from '../../Components/CustomPagination/CustomPagination';
import { Snackbar } from '../../Components/Snackbar/Snackbar';
import { ethers } from 'ethers';
import { toLocaleTimestamp } from '../../lib/parsers';

class Transaction extends Component {
  snackbarRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      transactions: {
        data: [],
        currentPage: 1,
        totalPages: 0,
        isLoading: true,
      }
    };

    this.fetchTransactions = this.fetchTransactions.bind(this);
  }

  componentDidMount(){
    this.fetchTransactions();
  }

  async fetchTransactions(start,length = 10){
    try {
      const res = await Apis.fetchTransactions(start,length);
      console.log('res',res);
      this.setState({
        transactions: {
          data: res.data,
          currentPage: Number(res.currentPage),
          totalPages: res.totalPages,
          isLoading: false
        }
      });
    } catch (e) {
      console.log(e);
      this.openSnackBar(e.message);
      this.setState({
        blocks: {
          ...this.state.blocks,
          data: [],
          isLoading: false
        }
      });
    }
  }

  openSnackBar(message){
    this.snackbarRef.current.openSnackBar(message);
  }


  render() {
    return (
      <div>
        <div className='booking-hero-bgd booking-hero-bgd-inner'>
          <Navbar />
          <h2 className="es-main-head es-main-head-inner">Transactions</h2>
        </div>
        <Container>

          <table className="es-transaction">
            <thead>
              <tr>
                <th>Txn Hash </th>
                <th>Block</th>
                <th>Age</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>(Txn Fee)</th>
              </tr>
            </thead>
            <tbody>
              {this.state.transactions.isLoading ?
                <tr><td colSpan="7">Loading...</td></tr>
                :
                this.state.transactions.data?.length ? 
                this.state.transactions.data?.map((transaction,i) => {
                  return <tr key={i+1}>
                    <td className="tr-color-txt"><AddressLink value={transaction.txn_hash} type="tx" shrink={true}/></td>
                    <td className="tr-color-txt"><AddressLink value={transaction.block.block_number} type="block"/></td>
                    <td>{moment(moment(transaction.createdOn).toDate()).fromNow()}</td>
                    <td>
                      {transaction.fromAddress.label && <Link to={'/'+ transaction.fromAddress.address}>{transaction.fromAddress.label}</Link>}
                      <span className="tr-color-txt">
                        <AddressLink value={transaction.fromAddress.address} type="address" shrink={transaction.fromAddress.label.length} />
                      </span></td>
                    <td>
                      {transaction.fromAddress.label && <Link to={'/'+ transaction.fromAddress.address}>{transaction.fromAddress.label}</Link>}
                      <span className="tr-color-txt">
                        <AddressLink value={transaction.toAddress.address} type="address" shrink={transaction.fromAddress.label.length} />
                      </span></td>
                    <td>{ethers.utils.formatEther(transaction.value)} ES </td>
                    <td>0.000546</td>
                  </tr>  
                })
                :
                <tr><td colSpan="7">No Transactions</td></tr>
              }
            </tbody>
          </table>
            <CustomPagination 
              handleClick={this.fetchTransactions} 
              currentPage={this.state.transactions.currentPage}
              prevPage={this.state.transactions.currentPage - 1}
              nextPage={this.state.transactions.currentPage + 1}
              totalPages={this.state.transactions.totalPages}
            />
          <Snackbar ref={this.snackbarRef} />
        </Container>
      </div>
    );

  }
}


export default Transaction;