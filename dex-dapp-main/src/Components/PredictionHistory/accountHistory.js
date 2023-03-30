import React, { useEffect, useState } from "react";
import "../Referral/referral.css";
import { Container, Row, Col } from "react-bootstrap";
import tokenLogo from "../../Assets/etm.png";
import ethIcon from "../../Assets/ethIcon.png";
import { toast } from "react-toastify";
import { ethers, BigNumber } from "ethers";
import { useAccount, useBalance, useNetwork, erc20ABI, useSigner } from "wagmi";
import { MdSwapVerticalCircle } from "react-icons/md";
import {
  TokenAddress,
  TokenABI,
  routerAddress,
  wbnbAddress,
} from "../../contract/index.js";

import "./index.css";

function BuyReferralsCard() {
  const [userReferralCode, setUserReferralCode] = useState("");
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const chainRpcUrl = chain?.rpcUrls?.default;
  const { address } = useAccount();
  const provider = new ethers.providers.StaticJsonRpcProvider(
    chainRpcUrl === undefined ? process.env.REACT_APP_DEFAULT_CHAIN_RPC : chainRpcUrl
  );

  const currentSigner = signer === undefined || signer === null ? provider : signer;

  const currentAddress = address === undefined ? "0x0000000000000000000000000000000000000000" : address;


  const [slippageInput, setSlippageInput] = useState(0);
  const [slippage, setSlippage] = useState(null);
  const handleSlippage = (value) => {
    setSlippage(value);
    setSlippageInput(value);
  };
  const [userBnbAmount, setUserBnbAmount] = useState(null);

  const getUserBnbBalance = async () => {
    if (address !== undefined) {
      const balance = await provider.getBalance(address);
      const balanceInBnb = ethers.utils.formatEther(balance);
      setUserBnbAmount(balanceInBnb);
    }
  };

  const [userMatrixAmount, setUserMatrixAmount] = useState(null);

  const getUserMatrixBalance = async () => {
    if (address !== undefined) {
      const matrixContract = new ethers.Contract(
        TokenAddress,
        TokenABI,
        provider
      );
      const matrixBalance = await matrixContract.balanceOf(address);
      const matrixBalanceInMatrix = ethers.utils.formatEther(matrixBalance);
      setUserMatrixAmount(matrixBalanceInMatrix);
    }
  };

  useEffect(() => {
    getUserBnbBalance();
    getUserMatrixBalance();
  }, [address, chainRpcUrl]);



  // BUY BNB VALUE
  const [bnbValue, setBnbValue] = useState(null);
  const [foundation, setFoundation] = useState(null);
  const [sendRateValue, setSendRateValue] = useState([]);
  const [foundationName, setFoundationName] = useState([]);

  const handleChange = (index, event) => {
    const newInputValues = [...sendRateValue];
    newInputValues[index] = event.target.value;
    setSendRateValue(newInputValues);
  };

  

  const handleAddInput = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    const foundationLength = await tokenContract.getFoundationCount();
    const foundationAddress = await tokenContract.getAllFoundation();
    setFoundationName(foundationAddress);
    console.log(Number(foundationLength));
    setSendRateValue([]);
    for (let i = 0; i < Number(foundationLength); i++) {
      setSendRateValue(sendRateValue => [...sendRateValue, '']);
      /* setSendRateValue([...sendRateValue,'']); */
    }
    
  };



  useEffect(() => {
    const interval = setInterval(
      (function x() {
        getUserBnbBalance()
        return x;
      })(),
      10000
    );

    return () => clearInterval(interval);
  }, []);

  const getuserReferralCodeFromAddress = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    const userReferralContract = await tokenContract.addressToReferrals(
      currentAddress
    );

    if (userReferralContract !== "") {
      setUserReferralCode(
        userReferralContract[2] !== "0x000000000000000000000000000000000000000 0"
          ? userReferralContract[2]
          : ""
      );
    } else {
      setUserReferralCode("");
    }
  };

  useEffect(() => {
    getuserReferralCodeFromAddress(address);
    
  }, [address]);

  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(true);

  const handleFoundationAdd = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    try {

        await tokenContract.connect(currentSigner).addFoundation(
            foundation
          );
    }catch (error) {
        console.log(error);
        toast.error(
          error
            ? error.reason === undefined
              ? error.message !== undefined
                ? error.message
                : "Something went wrong"
              : error.reason
            : "Something went wrong",
  
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    
  };

  const handleFoundationRemove = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    try {

        await tokenContract.connect(currentSigner).removeFoundation(
            foundation
          );
    }catch (error) {
        console.log(error);
        toast.error(
          error
            ? error.reason === undefined
              ? error.message !== undefined
                ? error.message
                : "Something went wrong"
              : error.reason
            : "Something went wrong",
  
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    
  };

  const handleFoundation = async (value, mode) => {
    setFoundation(value);
  };

  const [metaMaskHistory, setMetaMaskHistory] = useState([]);

  const getTransactionHist = async (address) => {

    let etherscanProvider = new ethers.providers.EtherscanProvider("goerli",'85STCM4J5ZXW91GZYDTS884TG3JK32B2IQ');
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    const foundationLength = await tokenContract.getFoundationCount();
    const foundationAddress = await tokenContract.getAllFoundation();
    setMetaMaskHistory([]);
    foundationAddress.forEach((foundAdress) => {
        console.log("asdasd:"+foundAdress);
        etherscanProvider.getHistory(foundAdress).then((history) => {
            setMetaMaskHistory(metaMaskHistory => [...metaMaskHistory,history]);
            console.log(history);
        });
    })
    };

  useEffect(() => {
    handleAddInput();
    getTransactionHist();
  }, [currentAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
        handleAddInput();
        getTransactionHist();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentAddress]);

  const tabledatas = [];

  if (metaMaskHistory !== null) {
   
    console.log(metaMaskHistory);
    metaMaskHistory.forEach((foundationHisto) => {
        foundationHisto.forEach((tx) => {
            if(tx.value>1){
                /* console.log(tx); */
                /* console.log(tx.from);
                console.log(tx.to); */
                tabledatas.push([tx.from,tx.to, Number(ethers.utils.formatEther(tx.value)).toFixed(4)]);
            }
    })
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
    <>
      <Container>
      <div className="dashboardTitle">Foundation List</div>
                  {sendRateValue.map((inputValue, index) => (
                        <div key={index}>
                          <div className="buyReferralsPartLeftText">{"Foundation "+(index+1)+"    "+"["+foundationName[index]+"]"}</div>
                          
                        </div>
                      ))}
        <Row>
          <Col
            lg={{ span: 4, offset: 4 }}
            md={{ span: 10, offset: 1 }}
            sm={{ span: 12 }}
          >
            <div className="buyReferralsCardMain">
            <div className="buySellTitle">{activeTab ? "FOUNDATION ADD" : "FOUNDATION REMOVE"}</div>
              <>
                <div className="buyReferralsCardBody">
                  <div className="buyReferralsBnbPart">
                    <div className="buyReferralsBnbPartUp">
                      <div className="buyReferralsBnbPartsLeft">
                        {/* <img src={ethIcon} className="buyReferralsIcon" />
                        <div className="buyReferralsPartLeftText">BNB</div> */}
                      </div>
                      {/* {address !== undefined && (
                        <div className="buyReferralsPartsRight">
                          Balance:{" "}
                          {userBnbAmount !== null
                            ? Number(userBnbAmount).toLocaleString()
                            : "-"}
                        </div>
                      )} */}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="0x0000...000"
                        className="buyReferralsInput"
                        value={bnbValue}
                        onChange={(e) =>
                            handleFoundation(e.target.value, "weth")
                        }
                      />
                    </div>
                    
            <div className="finishRoundsButtons">
                      <button
                        className="swapIconWrapper"
                        onClick={() => setActiveTab(!activeTab)}
                      >
                        <MdSwapVerticalCircle className="swapIcon" />
                      </button>
                    </div>
                  </div>

                </div>
                {activeTab ? (
                    <>
                    {foundation !== null && foundation !== "" ? (
                        <button
                          className="buyReferralsButton"
      
                          onClick={() => handleFoundationAdd()}
                        >
                          ADD{" "}
                          {buyLoading && <i className="fa fa-spinner fa-spin"></i>}
                        </button>
                      ) : (
                        <button className="buyReferralsButtonOpa">ADD</button>
                      )}
                      </>
                ):(
                    <>
                    {foundation !== null && foundation !== "" ? (
                        <button
                          className="buyReferralsButton"
      
                          onClick={() => handleFoundationRemove()}
                        >
                          REMOVE{" "}
                          {buyLoading && <i className="fa fa-spinner fa-spin"></i>}
                        </button>
                      ) : (
                        <button className="buyReferralsButtonOpa">REMOVE</button>
                      )}
                      </>
                )}
                
              </>
              )}
            </div>
          </Col>
        </Row>
        
        <div className="dashboardTitle">All Foundation Wallet Transfer History</div>
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
      </Container>
      
    </>
  );
}

export default BuyReferralsCard;

