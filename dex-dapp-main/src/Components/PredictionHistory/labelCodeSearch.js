import React, { useEffect, useState } from "react";
import "./index.css";
import { useNetwork, useSigner, useAccount } from "wagmi";
import { Link } from 'react-router-dom';
import { ethers } from "ethers";
import { TokenAddress, TokenABI } from "../../contract/index.js";
import { Container, Row, Col } from "react-bootstrap";

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

    const [personelInvoice, setPersonelInvoice] = useState([]);
    const [transferHistory, setTransferHistory] = useState([]);

    const [code, setCode] = useState(null);

    const getTopHistory = async () => {
        setTransferHistory([]);
        setPersonelInvoice([]);
        const allAddress = await matrixContract.getAlllabels();
        
        for (let i = 0; i < allAddress.length; i++) {
            console.log(allAddress[i][0]);
            try {
                const fetchTopHistory = await matrixContract.getAllTransfereHistory(allAddress[i][0]);
                const personelInvoiceArr = await matrixContract.getPersonelInvoice(allAddress[i][0]);
                setTransferHistory(transferHistory => [...transferHistory, fetchTopHistory]);
                setPersonelInvoice(personelInvoice => [...personelInvoice, personelInvoiceArr]);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleCode = async (value, mode) => {
        setCode(value);
    };

    useEffect(() => {
        /* getTopHistory(); */
    }, [currentAddress]);

    useEffect(() => {
        const interval = setInterval(() => {
            /* getTopHistory(); */
        }, 10000);
        return () => clearInterval(interval);
    }, [currentAddress]);

    const tabledatas = [];
    let countTHPersonelInvoice = 0;
    if (transferHistory !== null) {
        transferHistory.forEach(tHElement => {
            if (tHElement !== null) {
                for (let i = 0; i < tHElement.length; i++) {


                    let hash = ethers.utils.parseBytes32String(personelInvoice[countTHPersonelInvoice][i]);
                    if (hash === code &&  tabledatas.length === 0) {
                        console.log(tabledatas.length);
                        /* let from = tHElement[i][0]; // from
                                            let to = tHElement[i][1]; // to */
                        let from = ethers.utils.parseBytes32String(tHElement[i][5]); // from
                        let to = ethers.utils.parseBytes32String(tHElement[i][6]); // to
                        let fromCitizenNumber = ethers.utils.parseBytes32String(tHElement[i][2]); // fromCitizen
                        let toCitizenNumber = ethers.utils.parseBytes32String(tHElement[i][3]); // toCitizen
                        let donate = ethers.utils.formatEther(tHElement[i][4]); // refBalance
                        let donateAmount = Number(donate).toFixed(2); // refRewardBalance
                        if (donateAmount !== 0) {
                            tabledatas.push([hash, from.toLocaleUpperCase(), to.toLocaleUpperCase(), fromCitizenNumber, toCitizenNumber, donateAmount]);
                        }
                    }




                }
            }
            countTHPersonelInvoice++;
        });
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
                                {/* <td><Link to={"https://testnet.bscscan.com/address/"+item[1]} style={{ textDecoration: 'none' , color: 'white'}} target="_blank">{item[1]}</Link></td> */}
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                        return (
                            <tr>
                                <td>{item[2]}</td>
                                {/* <td><Link to={"https://testnet.bscscan.com/address/"+item[2]} style={{ textDecoration: 'none' , color: 'white'}} target="_blank">{item[2]}</Link></td> */}
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
        <Container>
            <Row>
                <Col
                    lg={{ span: 4, offset: 4 }}
                    md={{ span: 10, offset: 1 }}
                    sm={{ span: 12 }}
                >
                    <div className="buyReferralsCardMain">
                        <div className="buySellTitle"></div>
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
                                            placeholder="EFFAVJTLA"
                                            className="buyReferralsInput"
                                            /* value={code} */
                                            onChange={(e) =>
                                                handleCode(e.target.value, "weth")
                                            }
                                        />
                                    </div>
                                </div>

                            </div>

                            <>
                                {code !== null && code !== "" ? (
                                    <button
                                        className="buyReferralsButton"

                                        onClick={() => getTopHistory()}
                                    >
                                        SEARCH{" "}
                                    </button>
                                ) : (
                                    <button className="buyReferralsButtonOpa">SEARCH</button>
                                )}
                            </>


                        </>

                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
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
                </Col>
            </Row>
        </Container>

    );
}

export default Top25History;
