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
    setSendRateValue([]);
    console.log(Number(foundationLength));
    for (let i = 0; i < Number(foundationLength); i++) {
      setSendRateValue(sendRateValue => [...sendRateValue, '']);
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
    handleAddInput();
  }, [address]);

  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const handleBuy = async () => {
    let sumRate= 0;
    for (let i = 0; i < sendRateValue.length; i++) {
      sumRate += Number(sendRateValue[i]);
    }
    if(sumRate === 100){
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
        await tokenContract.transferBNB(sendRateValue,{
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
    }else{
      toast.error("Send Donate Rate Sum Not Equal 100", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    
  };
  const handleBuyBnbValue = async (value, mode) => {

    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || regex.test(value)) {
      setBnbValue(value);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col
            lg={{ span: 4, offset: 4 }}
            md={{ span: 10, offset: 1 }}
            sm={{ span: 12 }}
          >
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
                          <div className="buyReferralsPartLeftText">{"Foundation "+(index+1)+"    "+"["+foundationName[index].slice(0, 4)+"..."+foundationName[index].slice(
                        foundationName[index].length - 3,
                        foundationName[index].length
                      )+"]"}</div>
                          <input
                            type="text"
                            placeholder="0.0"
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
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BuyReferralsCard;
