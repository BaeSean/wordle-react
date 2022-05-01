import React from "react";

import "../style/Navigator.css";
import userImage from "../style/user.png";

const Navigator = () => {
  return (
    <div>
      <button><img src={userImage} alt="my image"/></button>
    </div>
  );
}

export default Navigator;
