import { createRef, useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Modal, Button, Spinner } from "react-bootstrap";
import { getCroppedImg } from "../helpers/canvas";

const FileUploader = ({ name, label, modalTitle, onFileSubmit }) => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileLoaded = (file) => {
    setFile(file);
    setShow(true);
  };

  return (
    <div>
      <div>
        <FileInput name={name} label={label} onFileLoaded={handleFileLoaded} croppedImage={croppedImage} />
      </div>
      <div>
        {show && (
          <FileModal
            show={show}
            onHide={() => setShow(false)}
            file={file}
            modalTitle={modalTitle}
            onFileSubmit={onFileSubmit}
            onImageCropped={setCroppedImage}
          />
        )}
      </div>
    </div>
  );
};

const FileInput = ({ label, name, onFileLoaded, croppedImage }) => {
  const imageInputRef = createRef();

  return (
    <div
      className="bg-white d-flex align-items-center my-2"
      style={{
        cursor: "pointer",
      }}
    >
      <div onClick={() => imageInputRef.current.click()}>
        {croppedImage ? (
          <img src={croppedImage} alt="image_cropped" style={{ maxWidth: "64px" }} />
        ) : (
          <img src="/assets/upload.png" alt="upload_image" />
        )}
      </div>
      <div className="d-flex align-items-center">
        <input
          id={name}
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="d-none"
          onClick={(event) => (event.target.value = null)}
          onChange={(e) => onFileLoaded(e.target.files[0])}
        />
        <label htmlFor={name} className="m-0 mx-2" style={{ cursor: "pointer" }}>
          {label}
        </label>
      </div>
    </div>
  );
};

const FileModal = ({ file, show, onHide, modalTitle, onFileSubmit, onImageCropped }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
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
    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(imageData, croppedArea, rotation);
      onFileSubmit(croppedImage);
      onImageCropped(URL.createObjectURL(croppedImage));
      setLoading(false);
      onHide();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="d-flex flex-column rounded">
        <h2>{modalTitle}</h2>
        <div style={{ position: "relative", minHeight: "300px", minWidth: "100%" }}>
          <Cropper
            image={imageData}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            onCropChange={setCrop}
            onCropComplete={(p, area) => setCroppedArea(area)}
          />
        </div>

        <div className="slider">
          <button onClick={() => setZoom(zoom - 0.1)}>-</button>
          <button onClick={() => setZoom(zoom + 0.1)}>+</button>
        </div>
        <div>
          <button className="me-1" onClick={() => setRotation(rotation - 90)}>
            Rotate Left
          </button>
          <button onClick={() => setRotation(rotation + 90)}>Rotate Right</button>
        </div>
        <Button variant="primary d-block w-100" onClick={submit}>
          {loading && <Spinner animation="border" />} OK
        </Button>
        <Button variant="secondary d-block w-100" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Header>
    </Modal>
  );
};

export default FileUploader;
