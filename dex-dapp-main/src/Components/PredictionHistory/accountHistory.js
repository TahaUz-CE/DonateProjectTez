import React, { useEffect, useState } from "react";
import "../Referral/referral.css";
import { Container, Row, Col } from "react-bootstrap";
import tokenLogo from "../../Assets/etm.png";
import ethIcon from "../../Assets/ethIcon.png";
import { toast } from "react-toastify";
import { ethers, BigNumber } from "ethers";
import { useAccount, useBalance, useNetwork, erc20ABI, useSigner } from "wagmi";
import { Link } from 'react-router-dom';
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


  useEffect(() => {
    getUserBnbBalance();
  }, [address, chainRpcUrl]);



  // BUY BNB VALUE
  const [bnbValue, setBnbValue] = useState(null);
  const [foundation, setFoundation] = useState(null);
  const [commercial, setCommercial] = useState(null);
  const [sendRateValue, setSendRateValue] = useState([]);
  const [sendRateValue2, setSendRateValue2] = useState([]);
  const [foundationName, setFoundationName] = useState([]);
  const [commercialName, setCommercialName] = useState([]);
  const [commercialUserName, setCommercialUserName] = useState([]);
  const [foundationUserName, setFoundationUserName] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState(null);

  const handleChange = (index, event) => {
    const newInputValues = [...sendRateValue];
    newInputValues[index] = event.target.value;
    setSendRateValue(newInputValues);
  };



  const handleAddInput = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    const foundationLength = await tokenContract.getFoundationCount();
    const commercialLength = await tokenContract.getCommercialFirmsCount();
    const foundationAddress = await tokenContract.getAllFoundation();
    const commercialAddress = await tokenContract.getAllCommercialFirms();
    const owner = await tokenContract._owner();
    setOwnerAddress(owner);
    const userUsername = await tokenContract.addressToLabels(currentAddress);
    const activeUsername = ethers.utils.parseBytes32String(userUsername.userName);

    setFoundationName(foundationAddress);
    setCommercialName(commercialAddress);
    /* console.log(Number(foundationLength)); */
    setSendRateValue([]);
    setSendRateValue2([]);
    setFoundationUserName([]);
    setCommercialUserName([]);
    for (let i = 0; i < Number(foundationLength); i++) {
      setSendRateValue(sendRateValue => [...sendRateValue, '']);
      const userUsername = await tokenContract.addressToLabels(foundationAddress[i]);
      /* console.log(ethers.utils.parseBytes32String(userUsername.userName)); */
      setFoundationUserName(foundationUserName => [...foundationUserName, ethers.utils.parseBytes32String(userUsername.userName).toUpperCase()]);
      /* setSendRateValue([...sendRateValue,'']); */
    }
    for (let i = 0; i < Number(commercialLength); i++) {
      setSendRateValue2(sendRateValue2 => [...sendRateValue2, '']);
      const userUsername = await tokenContract.addressToLabels(commercialAddress[i]);
      setCommercialUserName(commercialUserName => [...commercialUserName, ethers.utils.parseBytes32String(userUsername.userName).toUpperCase()]);
      /* setSendRateValue([...sendRateValue,'']); */
    }

  };



  useEffect(() => {
    const interval = setInterval(
      (function x() {
        getUserBnbBalance()
        return x;
      })(),
      30000
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
  const [activeTab2, setActiveTab2] = useState(true);

  const handleFoundationAdd = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    try {

      await tokenContract.connect(currentSigner).addFoundation(
        foundation
      );
    } catch (error) {
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
    } catch (error) {
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

  const handleCommercialAdd = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    try {

      await tokenContract.connect(currentSigner).addCommercialFirms(
        commercial
      );
    } catch (error) {
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

  const handleCommercialRemove = async () => {
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    try {

      await tokenContract.connect(currentSigner).removeCommercialFirms(
        commercial
      );
    } catch (error) {
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

  const handleCommercial = async (value, mode) => {
    setCommercial(value);
  };

  const [metaMaskHistory, setMetaMaskHistory] = useState([]);

  const getTransactionHist = async (address) => {

    let etherscanProvider = new ethers.providers.EtherscanProvider("goerli", '85STCM4J5ZXW91GZYDTS884TG3JK32B2IQ');
    const tokenContract = new ethers.Contract(TokenAddress, TokenABI, provider);
    const foundationLength = await tokenContract.getFoundationCount();
    const foundationAddress = await tokenContract.getAllFoundation();
    setMetaMaskHistory([]);
    foundationAddress.forEach((foundAdress) => {
      console.log("asdasd:" + foundAdress);
      etherscanProvider.getHistory(foundAdress).then((history) => {
        setMetaMaskHistory(metaMaskHistory => [...metaMaskHistory, history]);
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
    }, 30000);
    return () => clearInterval(interval);
  }, [currentAddress]);

  const tabledatas = [];

  if (metaMaskHistory !== null) {

    console.log(metaMaskHistory);
    let i = 0;
    metaMaskHistory.forEach((foundationHisto) => {
      console.log(foundationHisto);
      console.log(foundationName[i]);
      foundationHisto.forEach((tx) => {
        let check0 = false;
        let userNameFrom = "";

        const indexFrom = foundationName.indexOf(tx.from);

        if (indexFrom !== -1) {
          check0 = true;
          userNameFrom = foundationUserName[indexFrom]
        }

        if (tx.value > 1 /* && tx.from === foundationName[i] */ && check0 === true) {
          /* console.log(tx); */
          /* console.log(tx.from);
          console.log(tx.to); */
          let check = false;
          let userNameTo = "";
          const indexTo = commercialName.indexOf(tx.to);
            if (indexTo !== -1) {
              check = true;
              userNameTo = commercialUserName[indexTo]
            }
          const indexFromTo = foundationName.indexOf(tx.to);
            if (indexFromTo !== -1) {
              check = true;
              userNameTo = foundationUserName[indexFromTo]
            }
          
          let check1 = false;
          tabledatas.forEach((row) => {
            if (tx.from === row[0] && tx.to === row[1] && Number(ethers.utils.formatEther(tx.value)).toFixed(5) === row[2]) {
              check1 = true;
            }
          })
          if (check && !check1) {
            tabledatas.push([userNameFrom, userNameTo, Number(ethers.utils.formatEther(tx.value)).toFixed(5), "Approved"]);
          } else if (!check && !check1) {
            tabledatas.push([userNameFrom, tx.to, Number(ethers.utils.formatEther(tx.value)).toFixed(5), "Unapproved"]);
          }

        }
      })
      i++;
    })



  } else {
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
                {/* <td><Link to={"https://goerli.etherscan.io/address/" + item[0]} style={{ textDecoration: 'none', color: 'white' }} target="_blank">{item[0]}</Link></td> */}
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[1]}</td>
                {/* <td><Link to={"https://goerli.etherscan.io/address/" + item[1]} style={{ textDecoration: 'none', color: 'white' }} target="_blank">{item[1]}</Link></td> */}
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[2] + " ETH"}
                </td>
              </tr>
            );
          })}
        </td>
        <td>
          {tabledatas.slice(0, tabledatas.length).map((item, index) => {
            return (
              <tr>
                <td>{item[3]}
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
                    <td>{item[0]}</td>
                      {/* <td><Link>{item[0].slice(0, 5) + "..." + item[0].slice(-4)}</Link></td> */}
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
            <td>
              <div className="top25-mobile-thead">Rank</div>
              {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>
                        {item[3]}
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
        <Row>
          <Col><div className="dashboardTitle">Foundations Wallet List</div>
            {sendRateValue.map((inputValue, index) => (
              <div key={index}>
                {foundationUserName[index] !== undefined && (<div className="buyReferralsPartLeftText">{foundationUserName[index] + " [" + foundationName[index] + "]"}</div>)}

              </div>
            ))}
          </Col>
          <Col>
            <div className="dashboardTitle">Commercial Wallet List</div>
            {sendRateValue2.map((inputValue, index) => (
              <div key={index}>
                {commercialUserName[index] !== undefined && (<div className="buyReferralsPartLeftText">{commercialUserName[index] + " [" + commercialName[index] + "]"}</div>)}

              </div>
            ))}
          </Col>
        </Row>
        <Row>
          {ownerAddress === currentAddress && (<Col>

            <div className="buyReferralsCardMain">
              <div className="buySellTitle">{activeTab ? "FOUNDATION WALLET ADD" : "FOUNDATION WALLET REMOVE"}</div>
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
                ) : (
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

            </div>

          </Col>)}
          {ownerAddress === currentAddress && (<Col>

            <div className="buyReferralsCardMain">
              <div className="buySellTitle">{activeTab2 ? "COMMERCIAL WALLET ADD" : "COMMERCIAL WALLET REMOVE"}</div>
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
                          handleCommercial(e.target.value, "weth")
                        }
                      />
                    </div>

                    <div className="finishRoundsButtons">
                      <button
                        className="swapIconWrapper"
                        onClick={() => setActiveTab2(!activeTab2)}
                      >
                        <MdSwapVerticalCircle className="swapIcon" />
                      </button>
                    </div>
                  </div>

                </div>
                {activeTab2 ? (
                  <>
                    {commercial !== null && commercial !== "" ? (
                      <button
                        className="buyReferralsButton"

                        onClick={() => handleCommercialAdd()}
                      >
                        ADD{" "}
                        {buyLoading && <i className="fa fa-spinner fa-spin"></i>}
                      </button>
                    ) : (
                      <button className="buyReferralsButtonOpa">ADD</button>
                    )}
                  </>
                ) : (
                  <>
                    {commercial !== null && commercial !== "" ? (
                      <button
                        className="buyReferralsButton"

                        onClick={() => handleCommercialRemove()}
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
            </div>
          </Col>)}
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
                  <th>Trust Rank</th>
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

