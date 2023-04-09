import React, { useState } from "react";
import "./index.css";
import LabelCodeSearch from "../Components/PredictionHistory/labelCodeSearch";

function LabelCodeSearchPage() {
  return (
    <div className="predictionMainWrapper">
      <div className="mainDashboardTitle">Code Search</div>
      <div className="predictionTopWrapper">
        { <LabelCodeSearch /> }
      </div>
    </div>
  );
}

export default LabelCodeSearchPage;