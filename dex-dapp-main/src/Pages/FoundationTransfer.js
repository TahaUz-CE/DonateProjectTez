import React, { useState } from "react";
import "./index.css";
import FoundationTrans from "../Components/PredictionHistory/fouTransfer";

function FoundationTransferPage() {
  return (
    <div className="predictionMainWrapper">
      <div className="mainDashboardTitle">Foundation Tracking</div>
      <div className="predictionTopWrapper">
        { <FoundationTrans /> }
      </div>
    </div>
  );
}

export default FoundationTransferPage;