import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Uploader from "../components/shared/Uploader";
import FileUploader from "../components/FileUploader";

const Home = () => {
  const [croppedImg, setCroppedImg] = useState(null);
  return (
    <div>
      <h1>Uploader</h1>
      {/* <Uploader onFileSubmit={(img) => setCroppedImg(img)} /> */}
      <FileUploader
        name="card"
        label="Profile Pic"
        modalTitle="Upload Photo"
        onFileSubmit={(img) => console.log(img)}
      />
      {/* {croppedImg && <img src={croppedImg} className="img-fluid" />} */}
    </div>
  );
};

export default Home;
