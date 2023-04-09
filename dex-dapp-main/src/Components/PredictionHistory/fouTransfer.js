import React, { useEffect, useState } from "react";
import "./index.css";
import { useNetwork, useSigner, useAccount } from "wagmi";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { ethers } from "ethers";
import { TokenAddress, TokenABI } from "../../contract/index.js";

// 1-) UserName leri tablolarda gösterme olayını yap.
// 2-) Transfer History ye yeni eklenen değişkenleri entegre et.
// 3-) Bu tabloların arkasındaki bulanıklık tablo boyutu ile uyumlu yap

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
    const [totalDonationFou, setDonationFou] = useState([]);
    const [totalSpendingFou, setSpendingFou] = useState([]);
    const [allFoundationName, setAllFoundationName] = useState([]);
    const [allFoundationAddress, setAllFoundationAddress] = useState(null);

    const getTopHistory = async () => {
        const foundationAddress = await matrixContract.getAllFoundation();
        const citizenAndLabel = await matrixContract.addressToLabels(currentAddress);
        setAllFoundationAddress();
        setAllFoundationAddress(foundationAddress);
        setTransferHistory([]);
        setPersonelInvoice([]);
        setDonationFou([]);
        setSpendingFou([]);
        setAllFoundationName([]);
        for (let i = 0; i < foundationAddress.length; i++) {
            try {
                const fetchTopHistory = await matrixContract.getAllTransfereHistory(foundationAddress[i]);
                const personelInvoiceArr = await matrixContract.getPersonelInvoice(foundationAddress[i]);
                const citizenAndLabel = await matrixContract.addressToLabels(foundationAddress[i]);
                console.log(ethers.utils.parseBytes32String(citizenAndLabel[2]));
                console.log(Number(ethers.utils.formatEther(citizenAndLabel[3])).toFixed(4));
                console.log(Number(ethers.utils.formatEther(citizenAndLabel[4])).toFixed(4));
                setDonationFou(totalDonationFou => [...totalDonationFou, Number(ethers.utils.formatEther(citizenAndLabel[3])).toFixed(4)]);
                setSpendingFou(totalSpendingFou => [...totalSpendingFou, Number(ethers.utils.formatEther(citizenAndLabel[4])).toFixed(4)]);
                /* setTransferHistory(fetchTopHistory); */
                setAllFoundationName(allFoundationName => [...allFoundationName, ethers.utils.parseBytes32String(citizenAndLabel[2]).toUpperCase()]);
                setTransferHistory(transferHistory => [...transferHistory, fetchTopHistory]);
                /* setPersonelInvoice(personelInvoiceArr); */
                setPersonelInvoice(personelInvoice => [...personelInvoice, personelInvoiceArr]);
            } catch (e) {
                console.log(e);
            }
        }


    };

    useEffect(() => {
        getTopHistory();
    }, [currentAddress]);

    useEffect(() => {
        const interval = setInterval(() => {
            getTopHistory();
        }, 30000);
        return () => clearInterval(interval);
    }, [currentAddress]);

    // TO (DONATE)
    const tabledatas = [];
    let countTHPersonelInvoice = 0;
    if (transferHistory !== null) {
        console.log(allFoundationAddress);
        transferHistory.forEach(tHElement => {
            if (tHElement !== null) {
                for (let i = 0; i < tHElement.length; i++) {
                    let foundTo = false;
                    for (let k = 0; k < allFoundationAddress.length; k++) {
                        if (allFoundationAddress[k] === tHElement[i][1]) {
                            foundTo = true;
                        }
                    }
                    if (foundTo) {
                        let hash = ethers.utils.parseBytes32String(personelInvoice[countTHPersonelInvoice][i]);
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

    // FROM (SPEND)
    const tabledatas1 = [];
    let countTHPersonelInvoice1 = 0;
    if (transferHistory !== null) {
        console.log(allFoundationAddress);
        transferHistory.forEach(tHElement => {
            if (tHElement !== null) {
                for (let i = 0; i < tHElement.length; i++) {
                    let foundTo = false;
                    for (let k = 0; k < allFoundationAddress.length; k++) {
                        if (allFoundationAddress[k] === tHElement[i][0]) {
                            foundTo = true;
                        }
                    }
                    if (foundTo) {
                        let hash = ethers.utils.parseBytes32String(personelInvoice[countTHPersonelInvoice1][i]);
                        let from = ethers.utils.parseBytes32String(tHElement[i][5]); // from
                        let to = ethers.utils.parseBytes32String(tHElement[i][6]); // to
                        let fromCitizenNumber = ethers.utils.parseBytes32String(tHElement[i][2]); // fromCitizen
                        let toCitizenNumber = ethers.utils.parseBytes32String(tHElement[i][3]); // toCitizen
                        let donate = ethers.utils.formatEther(tHElement[i][4]); // refBalance
                        let donateAmount = Number(donate).toFixed(2); // refRewardBalance
                        if (donateAmount !== 0) {
                            tabledatas1.push([hash, from.toLocaleUpperCase(), to.toLocaleUpperCase(), fromCitizenNumber, toCitizenNumber, donateAmount]);
                        }
                    }


                }
            }
            countTHPersonelInvoice1++;
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
                                <td><Link to={"https://testnet.bscscan.com/address/" + item[1]} style={{ textDecoration: 'none', color: 'white' }} target="_blank">{item[1]}</Link></td>
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas.slice(0, tabledatas.length).map((item, index) => {
                        return (
                            <tr>
                                <td><Link to={"https://testnet.bscscan.com/address/" + item[2]} style={{ textDecoration: 'none', color: 'white' }} target="_blank">{item[2]}</Link></td>
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

    const RowDatas1 = (datas) => {
        return (
            <tr>
                <td>
                    {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
                        return (
                            <tr>
                                <td>{item[0]}</td>
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
                        return (
                            <tr>
                                <td><Link to={"https://testnet.bscscan.com/address/" + item[1]} style={{ textDecoration: 'none', color: 'white' }} target="_blank">{item[1]}</Link></td>
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
                        return (
                            <tr>
                                <td><Link to={"https://testnet.bscscan.com/address/" + item[2]} style={{ textDecoration: 'none', color: 'white' }} target="_blank">{item[2]}</Link></td>
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
                        return (
                            <tr>
                                <td>{item[3]}</td>
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
                        return (
                            <tr>
                                <td>{item[4]}</td>
                            </tr>
                        );
                    })}
                </td>
                <td>
                    {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
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

    const RowTransactionsMobile1 = (datas) => {
        return (
            <div className="transaction-body-mobile">
                <div className="transaction-body-text">
                    <tbody className="trMain">
                        <td>
                            <div className="top25-mobile-thead">Address</div>
                            {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
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
                            {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
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
                            {tabledatas1.slice(0, tabledatas1.length).map((item, index) => {
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
            <div className="dashboardTitle">Donors To The Foundation</div>
            {totalDonationFou.map((inputValue,index) => (
              <div key={index}>
                {totalDonationFou[index] !== undefined && (<div className="totalDonateSpendTitle">{allFoundationName[index]+" Total Donate: "+totalDonationFou[index]}</div>)}

              </div>
            ))}
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
            </Row>
            <Row>
            <div className="dashboardTitle"></div>
            <div className="dashboardTitle">Expenditures Of Foundations</div>
            {totalSpendingFou.map((inputValue,index) => (
              <div key={index}>
                {totalSpendingFou[index] !== undefined && (<div className="totalDonateSpendTitle">{allFoundationName[index]+" Total Spending: "+totalSpendingFou[index]}</div>)}

              </div>
            ))}
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
                            <RowDatas1 item={item} key={index} />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="transactionsMobile">
                {[0].map((item, index) => (
                    <RowTransactionsMobile1 item={item} key={index} />
                ))}
            </div>
        </div>
            </Row>
            
        </Container>
        
    );
}

export default Top25History;
