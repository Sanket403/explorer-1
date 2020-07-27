import React, { Component } from 'react';
import './address.css';
import Images from '../Images/Images';
import Header from '../../Components/Header/Header';
import Navbar from '../../Components/Navbar/Navbar';
import { Col, Button, Container, Row, Tabs, Tab } from 'react-bootstrap';
import Apis from '../../lib/apis';
import { toLocaleTimestamp } from '../../lib/parsers';
import { Snackbar } from '../../Components/Snackbar/Snackbar';
import AddressLink from '../../Components/AddressLink/AddressLink';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import CustomPagination from '../../Components/CustomPagination/CustomPagination';
import config from '../../config/config';

class Address extends Component {
  snackbarRef = React.createRef();

  constructor(props) {
    super(props);

    const {
      match: { params },
    } = this.props;

    this.state = {
      address: params.address,
      data: {
        label: null,
        balance: null,
      },
      isLoading: true,
      transactions: {
        data: {},
        total: 0,
        isLoading: false,
      },
    };

    this.openSnackBar = this.openSnackBar.bind(this);
  }

  componentDidMount() {
    this.fetchAddress();
    this.fetchTransactionsByAddress();
    this.fetchBalance();
  }

  async fetchBalance() {
    const customHttpProvider = new ethers.providers.JsonRpcProvider(
      config.nodeUrl
    );
    const balance = await customHttpProvider.getBalance(this.state.address);
    this.setState({
      data: {
        label: this.state.label,
        balance: ethers.utils.formatEther(balance),
      },
    });
  }

  async fetchAddress() {
    try {
      const res = await Apis.fetchAddress(this.state.address);

      if (Object.keys(res).length)
        this.setState({
          data: res,
          isLoading: false,
        });
      else this.openSnackBar(res.error.message);
    } catch (e) {
      console.log(e);
      this.openSnackBar(e);
      this.setState({
        data: {},
        isLoading: false,
      });
    }
  }

  async fetchTransactionsByAddress() {
    try {
      const res = await Apis.fetchTransactionsByAddress(this.state.address);

      this.setState({
        transactions: {
          data: res.data,
          total: res.total,
          isLoading: false,
        },
      });
    } catch (e) {
      console.log(e);
      this.openSnackBar(e);
      this.setState({
        blocks: {
          ...this.state.blocks,
          data: [],
          isLoading: false,
        },
      });
    }
  }

  openSnackBar(message) {
    this.snackbarRef.current.openSnackBar(message);
  }

  render() {
    return (
      <div>
        <div className="booking-hero-bgd booking-hero-bgd-inner">
          <Navbar />
          <h2 className="es-main-head es-main-head-inner">
            Address #{this.state.address}
          </h2>
        </div>
        <div className="wrapper-container">
          <div className="BlockPage-detail">
            <Container>
              <div className="row">
                <div className="col-sm-6">
                  <table>
                    <tr>
                      <td colSpan="2">Overview</td>
                    </tr>
                    <tr>
                      <td>Balance</td>
                      <td>{this.state.data.balance} ES</td>
                    </tr>
                    <tr>
                      <td>Label</td>
                      <td>{this.state.data.label || '-'}</td>
                    </tr>
                  </table>
                </div>
                <div className="col-sm-6"></div>
              </div>
              <div className="">
                <Tabs
                  defaultActiveKey="transactions"
                  id="uncontrolled-tab-example"
                >
                  <Tab eventKey="transactions" title="Transactions">
                    {this.state.isLoading
                      ? 'Loading...'
                      : `Showing ${this.state.transactions.data.length} of ${this.state.transactions.total}`}
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
                        {this.state.transactions.isLoading ? (
                          <tr>
                            <td colSpan="7">Loading...</td>
                          </tr>
                        ) : this.state.transactions.data?.length ? (
                          this.state.transactions.data?.map(
                            (transaction, i) => {
                              return (
                                <tr key={i + 1}>
                                  <td className="tr-color-txt">
                                    <AddressLink
                                      value={transaction.txn_hash}
                                      type="tx"
                                      shrink={true}
                                    />
                                  </td>
                                  <td className="tr-color-txt">
                                    <AddressLink
                                      value={transaction.block.block_number}
                                      type="block"
                                    />
                                  </td>
                                  <td>
                                    {toLocaleTimestamp(
                                      transaction.createdOn
                                    ).fromNow()}
                                  </td>
                                  <td>
                                    {transaction.fromAddress.label && (
                                      <Link
                                        to={
                                          '/' + transaction.fromAddress.address
                                        }
                                      >
                                        {transaction.fromAddress.label}
                                      </Link>
                                    )}
                                    <span className="tr-color-txt">
                                      <AddressLink
                                        value={transaction.fromAddress.address}
                                        type="address"
                                        shrink={
                                          transaction.fromAddress.label.length
                                        }
                                      />
                                    </span>
                                  </td>
                                  <td>
                                    {transaction.fromAddress.label && (
                                      <Link
                                        to={
                                          '/' + transaction.fromAddress.address
                                        }
                                      >
                                        {transaction.fromAddress.label}
                                      </Link>
                                    )}
                                    <span className="tr-color-txt">
                                      <AddressLink
                                        value={transaction.toAddress.address}
                                        type="address"
                                        shrink={
                                          transaction.fromAddress.label.length
                                        }
                                      />
                                    </span>
                                  </td>
                                  <td>
                                    {ethers.utils.formatEther(
                                      transaction.value
                                    )}{' '}
                                    ES{' '}
                                  </td>
                                  <td>0.000546</td>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td colSpan="7">No Transactions</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <Snackbar ref={this.snackbarRef} />
                  </Tab>
                </Tabs>
              </div>
              <Snackbar ref={this.snackbarRef} />
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default Address;
