import React, { useEffect, useState } from "react";
import "./referral.css";
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

import {
  swapExactETHForTokensSupportingFeeOnTransferTokens,
  swapExactTokensForETHSupportingFeeOnTransferTokens,
  getAmountsOut,
  getReservess,
  getPriceImpact,
} from "../../hook/hooks.js";

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
  const [fTAddress, setFTAddress] = useState(null);
  const [sendRateValue, setSendRateValue] = useState([]);
  const [foundationName, setFoundationName] = useState([]);
  const [foundationUserName, setFoundationUserName] = useState([]);
  const [sendRateValue2, setSendRateValue2] = useState([]);
  const [commercialName, setCommercialName] = useState([]);
  const [commercialUserName, setCommercialUserName] = useState([]);
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
        handleAddInput()
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
    /* handleAddInput(); */
  }, [address]);

  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const handleBuy = async () => {
    let sumRate = 0;
    for (let i = 0; i < sendRateValue.length; i++) {
      sumRate += Number(sendRateValue[i]);
    }
    if (sumRate === 100) {
      if (signer === undefined || signer === null) {
        toast.error("Please connect your wallet", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
      const currentSigner =
        signer === undefined || signer === null ? provider : signer;

      const amountIn =
        bnbValue === null
          ? 0
          : ethers.utils.parseEther(parseFloat(bnbValue).toFixed(6).toString(10));
      const sendSlippage =
        slippageInput === null || slippageInput === "" ? "50" : slippageInput;

      try {
        const tokenContract = new ethers.Contract(TokenAddress, TokenABI, currentSigner);
        /* console.log("HELLO"+bnbValue);
        console.log("hi"+currentAddress); */
        await tokenContract.transferBNB(sendRateValue, {
          value: ethers.utils.parseEther(parseFloat(bnbValue).toFixed(6).toString(10)),
        });

        toast.success("Succesfully Bought", {
          position: toast.POSITION.TOP_CENTER,
        });
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
    } else {
      toast.error("Send Donate Rate Sum Not Equal 100", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

  };

  const handleFoundationBuy = async () => {

    if (signer === undefined || signer === null) {
      toast.error("Please connect your wallet", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    let foundAdress = false;
    commercialName.forEach(element => {
      if (fTAddress === element) {
        foundAdress = true;
      }
    });
    if (fTAddress === "" || !foundAdress) {
      toast.error("Please check foundation address", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    const currentSigner =
      signer === undefined || signer === null ? provider : signer;

    const amountIn =
      bnbValue === null
        ? 0
        : ethers.utils.parseEther(parseFloat(bnbValue).toFixed(6).toString(10));
    const sendSlippage =
      slippageInput === null || slippageInput === "" ? "50" : slippageInput;

    try {
      const tokenContract = new ethers.Contract(TokenAddress, TokenABI, currentSigner);
      /* console.log("HELLO"+bnbValue);
      console.log("hi"+currentAddress); */
      /* await tokenContract.transferFoundationBNB(fTAddress, {
        value: ethers.utils.parseEther(parseFloat(bnbValue).toFixed(6).toString(10)),
      }); */
      await tokenContract.transferFoundationBNB(fTAddress, ethers.utils.parseEther(parseFloat(bnbValue).toFixed(6).toString(10)));
      toast.success("Succesfully Bought", {
        position: toast.POSITION.TOP_CENTER,
      });
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

  const handleBuyBnbValue = async (value, mode) => {

    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || regex.test(value)) {
      setBnbValue(value);
    }
  };

  const handleFoundationTransferAddress = async (value, mode) => {

    setFTAddress(value);
  };

  return (
    <>
      <Container>
        <Row>
          
          {!foundationName.includes(currentAddress) &&(<Col>
            <div className="dashboardTitle">Donater Transfer</div>
            <div className="buyReferralsCardMain">
              <div className="buySellTitle">{"SAVE THE WORLD"}</div>(
              <>
                <div className="buyReferralsCardBody">
                  <div className="buyReferralsBnbPart">
                    <div className="buyReferralsBnbPartUp">
                      <div className="buyReferralsBnbPartsLeft">
                        <img src={ethIcon} className="buyReferralsIcon" />
                        <div className="buyReferralsPartLeftText">BNB</div>
                      </div>
                      {address !== undefined && (
                        <div className="buyReferralsPartsRight">
                          Balance:{" "}
                          {userBnbAmount !== null
                            ? Number(userBnbAmount).toLocaleString()
                            : "-"}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="0.0"
                        className="buyReferralsInput"
                        value={bnbValue}
                        onChange={(e) =>
                          handleBuyBnbValue(e.target.value, "weth")
                        }
                      />
                      <br></br>
                      <div className="buyReferralsPartLeftText">Donation Rate For Each Foundation</div>
                      <br></br>

                      {sendRateValue.map((inputValue, index) => (
                        <div key={index}>
                          { (foundationUserName[index] !== undefined && foundationName[index] !== undefined ) && (<div className="buyReferralsPartLeftText">{foundationUserName[index]+" [" + foundationName[index].slice(0, 4) + "..." + foundationName[index].slice(
                            foundationName[index].length - 3,
                            foundationName[index].length
                          ) + "]"}</div>)}
                          <input
                            type="text"
                            placeholder="%0.0"
                            className="buyReferralsInput"
                            value={inputValue}
                            onChange={event => handleChange(index, event)}
                          />
                        </div>
                      ))}
                      {/* <button type="button" onClick={handleAddInput}>
                        Add New Text
                      </button> */}

                    </div>
                  </div>



                </div>

                {bnbValue !== null && bnbValue !== "" && bnbValue > 0 ? (
                  <button
                    className="buyReferralsButton"

                    onClick={() => handleBuy()}
                  >
                    DONATE{" "}
                    {buyLoading && <i className="fa fa-spinner fa-spin"></i>}
                  </button>
                ) : (
                  <button className="buyReferralsButtonOpa">DONATE</button>
                )}
              </>
              
            </div>
          </Col>)}
          {foundationName.includes(currentAddress) && (<Col>
            <div className="dashboardTitle">Foundation Transfer</div>
            <div className="buyReferralsCardMain">
              <div className="buySellTitle">{"SAVE THE WORLD"}</div>(
              <>
                <div className="buyReferralsCardBody">
                  <div className="buyReferralsBnbPart">
                    <div className="buyReferralsBnbPartUp">
                      <div className="buyReferralsBnbPartsLeft">
                        <img src={ethIcon} className="buyReferralsIcon" />
                        <div className="buyReferralsPartLeftText">BNB</div>
                      </div>
                      {address !== undefined && (
                        <div className="buyReferralsPartsRight">
                          Balance:{" "}
                          {userBnbAmount !== null
                            ? Number(userBnbAmount).toLocaleString()
                            : "-"}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="0.0"
                        className="buyReferralsInput"
                        value={bnbValue}
                        onChange={(e) =>
                          handleBuyBnbValue(e.target.value, "weth")
                        }
                      />
                      <br></br>
                      <div className="buyReferralsPartLeftText">Contracted Commercial Companies List</div>
                      <br></br>

                      {sendRateValue.map((inputValue, index) => (
                        <div key={index}>
                          {(commercialUserName[index] !== undefined && commercialName[index] !== undefined ) && (<div className="buyReferralsPartLeftText">{ commercialUserName[index]+ " [" + commercialName[index] + "]"}</div>)}
                          {/* <input
                            type="text"
                            placeholder="%0.0"
                            className="buyReferralsInput"
                            value={inputValue}
                            onChange={event => handleChange(index, event)}
                          /> */}
                        </div>
                      ))}
                      <br></br>
                      <input
                        type="text"
                        placeholder="0x00...0000"
                        className="buyReferralsInput"
                        value={fTAddress}
                        onChange={(e) =>
                          handleFoundationTransferAddress(e.target.value, "weth")
                        }
                      />
                      {/* <button type="button" onClick={handleAddInput}>
                        Add New Text
                      </button> */}

                    </div>
                  </div>



                </div>

                {bnbValue !== null && bnbValue !== "" && bnbValue > 0 ? (
                  <button
                    className="buyReferralsButton"

                    onClick={() => handleFoundationBuy()}
                  >
                    TRANSFER{" "}
                    {buyLoading && <i className="fa fa-spinner fa-spin"></i>}
                  </button>
                ) : (
                  <button className="buyReferralsButtonOpa">TRANSFER</button>
                )}
              </>
              )}
            </div>
          </Col>)}
        </Row>

      </Container>
    </>
  );
}

export default BuyReferralsCard;
