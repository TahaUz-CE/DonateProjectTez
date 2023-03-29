import React, { useState } from "react";
import "./index.css";
import TopHistory from "../Components/PredictionHistory/top25.js";
import YourSummary from "../Components/PredictionHistory/yourSummary.js";
import AccountHistory from "../Components/PredictionHistory/accountHistory";

function HistoryPage() {
  return (
    <div className="predictionMainWrapper">
      <div className="dashboardTitle">Your Account Info</div>
      <div className="predictionTopWrapper">
        <YourSummary />
      </div>
      <div className="dashboardTitle">Foundation Wallet Transfer History</div>
      <div className="predictionTopWrapper">
        { <AccountHistory /> }
      </div>
      <div className="dashboardTitle">Your Transfer History</div>
      <div className="predictionTopWrapper">
        { <TopHistory /> }
      </div>
    </div>
  );
}

export default HistoryPage;
