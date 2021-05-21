import React, { createRef, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../helpers/canvas";

const Uploader = ({ onFileSubmit }) => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileUpload = (file) => {
    setFile(file);
    setShow(true);
  };

  return (
    <div>
      <FileInput onFileUpload={handleFileUpload} />
      {show && <FileModal show={show} onHide={() => setShow(false)} file={file} onFileSubmit={onFileSubmit} />}
    </div>
  );
};

const FileInput = ({ onFileUpload }) => {
  const fileRef = createRef();

  return (
    <div>
      <input
        type="file"
        accept="images/*"
        ref={fileRef}
        onClick={(e) => (e.target.value = null)}
        onChange={(e) => onFileUpload(e.target.files[0])}
        className="d-none"
      />
      <button className="btn btn-primary" onClick={() => fileRef.current.click()}>
        Upload File
      </button>
    </div>
  );
};

const FileModal = ({ show, onHide, file, onFileSubmit }) => {
  const [imageData, setImageData] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 150 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState(null);

  const read_file = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageData(reader.result);
    };
  };

  useEffect(() => {
    read_file(file);
  }, []);

  const submit = async () => {
    const croppedImg = await getCroppedImg(imageData, croppedArea, rotation);
    onFileSubmit(croppedImg);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>Upload Your Photo</Modal.Header>
      <Modal.Body className="" style={{ position: "relative", height: "300px", backgroundColor: "white" }}>
        <Cropper
          image={imageData}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          onCropChange={setCrop}
          onCropComplete={(p, area) => setCroppedArea(area)}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="zoom__buttons">
          <button className="zoom__buttons--small" onClick={() => setZoom(zoom - 0.1)}>
            -
          </button>
          <button className="zoom__buttons--big" onClick={() => setZoom(zoom + 0.1)}>
            +
          </button>
        </div>
        <div className="rotate__buttons">
          <button className="rotate__buttons--left" onClick={() => setRotation(rotation - 90)}>
            Left
          </button>
          <button className="rotate__buttons--right" onClick={() => setRotation(rotation + 90)}>
            Right
          </button>
        </div>
        <button onClick={submit}>OK</button>
      </Modal.Footer>
    </Modal>
  );
};

export default Uploader;
