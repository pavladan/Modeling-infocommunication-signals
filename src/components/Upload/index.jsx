import React, { useState } from "react";
import { Button, message } from "antd";
import { UploadOutlined, PaperClipOutlined } from "@ant-design/icons";
import "./Upload.scss";

export default function Upload(props) {
  const [filename, setFilename] = useState();
  const openFile = (e) => {
    const fr = new FileReader();
    const name = e.name;
    fr.onload = (e) => {
      try {
        const result = e.target.result;
        const data = JSON.parse(result);
        props.setImportData(data);
        message.success("Файл загружен успешно");
        setFilename(name);
      } catch (err) {
        message.error("Ошибка при загрузке файла");
      }
    };
    fr.readAsText(e);
  };

  return (
    <div className="Upload">
      <div className="Upload-btn">
        <Button
          icon={<UploadOutlined />}
          shape="round"
          style={{ position: "relative" }}
        >
          Выберите файл
          <input
            type="file"
            id="file-selector"
            accept={props.accept}
            onChange={(e) => openFile(e.target.files[0])}
          ></input>
        </Button>
      </div>
      <div className="file-name">
        {filename && (
          <div>
            {" "}
            <PaperClipOutlined /> {filename}
          </div>
        )}
      </div>
    </div>
  );
}
