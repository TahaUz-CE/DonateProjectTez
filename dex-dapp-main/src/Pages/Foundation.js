import React, { useState } from "react";
import "./index.css";
import AccountHistory from "../Components/PredictionHistory/accountHistory";

function FoundationPage() {
  return (
    <div className="predictionMainWrapper">
      <div className="mainDashboardTitle">Foundation Transactions</div>
      <div className="predictionTopWrapper">
        { <AccountHistory /> }
      </div>
    </div>
  );
}

export default FoundationPage;