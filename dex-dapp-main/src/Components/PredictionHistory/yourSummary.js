import React, { useEffect, useState } from "react";
import "./index.css";
import { useNetwork, useSigner, useAccount } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import { TokenAddress, TokenABI} from "../../contract/index.js";

function SummaryPage() {
  const { chain } = useNetwork();
  const chainRpcUrl = chain?.rpcUrls?.default;
  const { address } = useAccount();
  const provider = new ethers.providers.StaticJsonRpcProvider(
    chainRpcUrl === undefined ? process.env.REACT_APP_DEFAULT_CHAIN_RPC : chainRpcUrl
  );
  const { data: signer } = useSigner();
  const [fromAddress, setFromAddress] = useState(null);
  const [toAddress, setToAddress] = useState(null);
  const [citizenNumber, setCitizenNumber] = useState(null);
  const [labelCode, setLabelCode] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [userBnbAmount, setUserBnbAmount] = useState(null);

  const currentAddress =
    address === undefined
      ? "0x0000000000000000000000000000000000000000"
      : address;

  const currentSigner =
    signer === undefined || signer === null ? provider : signer;

  const matrixContract = new ethers.Contract(TokenAddress, TokenABI, provider);
  
  const getUserBnbBalance = async () => {
    if (address !== undefined) {
      const balance = await provider.getBalance(address);
      const balanceInBnb = ethers.utils.formatEther(balance);
      setUserBnbAmount(balanceInBnb);
    }
  };

  const getuserRef = async () => {
    try {
      const citizenAndLabel = await matrixContract.addressToLabels(currentAddress);
      
      let citizenNumber = ethers.utils.parseBytes32String(citizenAndLabel[0]);
      let labelCode = ethers.utils.parseBytes32String(citizenAndLabel[1]);
      let totalBalance =Number(ethers.utils.formatEther(citizenAndLabel[2])).toFixed(4) ;
      
      setToAddress(toAddress);
      setCitizenNumber(citizenNumber);
      setLabelCode(labelCode);
      setTotalBalance(totalBalance);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getuserRef();
    getUserBnbBalance();
  }, [address,userBnbAmount]);

  const tabledatas = [
    [
      currentAddress,
      labelCode,
      userBnbAmount,
      totalBalance,
      citizenNumber,
    ],
  ];

  const RowTransactions = (datas) => {
    return (
      <tr>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[0]}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>
                  {item[4]}
                </td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[1]}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{Number(item[2]).toFixed(4)}{" BNB"}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[3]}{" BNB"}</td>
              </tr>
            );
          })}
        </td>
      </tr>
    );
  };

  const RowTransactionsMobile = (datas) => {
    return (
      <div className="transaction-body-mobileY">
        <div className="transaction-body-textY">
          <span>Address</span>
        </div>
        <div className="transaction-mobile-data">
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[0]}</td>
              </tr>
            );
          })}
        </div>

        <div className="transaction-body-textY">
          <span>Label Share</span>
        </div>
        <div className="transaction-mobile-data">
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>
                  {item[1]}
                  {" DTK"}
                </td>
              </tr>
            );
          })}
        </div>
        <div className="transaction-body-textY">
          <span>From Label Code</span>
        </div>
        <div className="transaction-mobile-data">
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[3]}</td>
              </tr>
            );
          })}
        </div>

        <div className="transaction-body-textY">
          <span>To Label Code</span>
        </div>
        <div className="transaction-mobile-data">
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[2]}</td>
              </tr>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="transactionsWrapper">
      <div className="transactions">
        <table>
          <thead>
            <tr className="transactions-thead">
              <th>My Address</th>
              <th>Citizen Number</th>
              <th>Login Code </th>
              <th>User BNB Balance</th>
              <th>Total Donate</th>
            </tr>
          </thead>

          <tbody className="transactions-tbody">
            {tabledatas.map((item, index) => (
              <RowTransactions item={item} key={index} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="transtactionMobile">
        {tabledatas.map((item, index) => (
          <RowTransactionsMobile item={item} key={index} />
        ))}
      </div>
    </div>
  );
} 

export default SummaryPage;
