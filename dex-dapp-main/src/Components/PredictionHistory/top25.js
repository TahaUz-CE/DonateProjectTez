import React, { useEffect, useState } from "react";
import "./index.css";
import { useNetwork, useSigner, useAccount } from "wagmi";

import { ethers } from "ethers";
import { TokenAddress, TokenABI } from "../../contract/index.js";

function Top25History() {
  const { chain } = useNetwork();
  const chainRpcUrl = chain?.rpcUrls?.default;
  const { address } = useAccount();
  const provider = new ethers.providers.StaticJsonRpcProvider(
    chainRpcUrl === undefined ? process.env.DEFAULT_RPC_URL : chainRpcUrl
  );

  const { data: signer } = useSigner();

  let currentAddress =
    address === undefined
      ? "0x0000000000000000000000000000000000000000"
      : address;

  const matrixContract = new ethers.Contract(TokenAddress, TokenABI, provider);

  const currentSigner =
    signer === undefined || signer === null ? provider : signer;

  const [personelInvoice, setPersonelInvoice] = useState(null);
  const [transferHistory, setTransferHistory] = useState(null);

  

  const getTopHistory = async () => {
    try {
      const fetchTopHistory = await matrixContract.getAllTransfereHistory(currentAddress);
      const personelInvoiceArr = await matrixContract.getPersonelInvoice(currentAddress);
      setTransferHistory(fetchTopHistory);
      setPersonelInvoice(personelInvoiceArr);
    } catch (e) {
      console.log(e);
    }  
  };

  useEffect(() => {
    getTopHistory();
  }, [currentAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      getTopHistory();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentAddress]);

  const tabledatas = [];

  if (transferHistory !== null) {
    for (let i = 0; i < transferHistory.length; i++) {
      let hash = ethers.utils.parseBytes32String(personelInvoice[i]);
      let from = transferHistory[i][0]; // from
      let to = transferHistory[i][1]; // to
      let fromCitizenNumber = ethers.utils.parseBytes32String(transferHistory[i][2]); // fromCitizen
      let toCitizenNumber = ethers.utils.parseBytes32String(transferHistory[i][3]); // toCitizen
      let donate = ethers.utils.formatEther(transferHistory[i][4]); // refBalance
      let donateAmount = Number(donate).toFixed(2); // refRewardBalance
      if(donateAmount != 0){
        tabledatas.push([hash,from, to, fromCitizenNumber, toCitizenNumber, donateAmount]);
      }
      
    }
  }

  const RowDatas = (datas) => {
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
                <td>{item[1]}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[2]}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[3]}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[4]}</td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>
                  {item[5]}
                  {" BNB"}
                </td>
              </tr>
            );
          })}
        </td>
      </tr>
    );
  };

  const RowTransactionsMobile = (datas) => {
    return (
      <div className="transaction-body-mobile">
        <div className="transaction-body-text">
          <tbody className="trMain">
            <td>
              <div className="top25-mobile-thead">Address</div>
              {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>{item[0].slice(0, 5) + "..." + item[0].slice(-4)}</td>
                    </tr>
                  </>
                );
              })}
            </td>
            <td>
              <div className="top25-mobile-thead">My Ref.Code</div>
              {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>{item[1]}</td>
                    </tr>
                  </>
                );
              })}
            </td>

            <td>
              <div className="top25-mobile-thead">Ref.Rewards</div>
              {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>
                        {item[2]}
                        {" BNB"}
                      </td>
                    </tr>
                  </>
                );
              })}
            </td>
          </tbody>
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
              <th>Code</th>
              <th>From</th>
              <th>To</th>
              <th>Citizen Num(From)</th>
              <th>Citizen Num(To)</th>
              <th>Donate Amount</th>
              
            </tr>
          </thead>

          <tbody className="transactions-tbody">
            {[0].map((item, index) => (
              <RowDatas item={item} key={index} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="transactionsMobile">
        {[0].map((item, index) => (
          <RowTransactionsMobile item={item} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Top25History;
