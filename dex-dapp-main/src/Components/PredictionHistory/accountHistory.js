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

  const [metaMaskHistory, setMetaMaskHistory] = useState(null);

  const getTransactionHist = async (address) => {
    let etherscanProvider = new ethers.providers.EtherscanProvider("goerli",'85STCM4J5ZXW91GZYDTS884TG3JK32B2IQ');
    etherscanProvider.getHistory(currentAddress).then((history) => {
        setMetaMaskHistory(history);
        /* history.forEach((tx) => {
            if(tx.value>1){
                console.log(tx);
            }
            
            //setMetaMaskAmount(Number(ethers.utils.formatEther(tx.value)).toFixed(2));
        }) */
    });
    };

  useEffect(() => {
    getTransactionHist();
  }, [currentAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
        getTransactionHist();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentAddress]);

  const tabledatas = [];

  if (metaMaskHistory !== null) {
   
        metaMaskHistory.forEach((tx) => {
            if(tx.value>1){
                /* console.log(tx); */
                /* console.log(tx.from);
                console.log(tx.to); */
                tabledatas.push([tx.from,tx.to, Number(ethers.utils.formatEther(tx.value)).toFixed(4)]);
            }
    })
      
    
  }else{
    console.log("null");
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
                <td>{item[2]}
                    {" ETH"}
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
              <div className="top25-mobile-thead">From</div>
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
              <div className="top25-mobile-thead">To</div>
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
              <div className="top25-mobile-thead">Amount</div>
              {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>
                        {item[2]}
                        {" ETH"}
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
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              
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
