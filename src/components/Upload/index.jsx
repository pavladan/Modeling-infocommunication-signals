import React, { useRef } from "react";
import { message } from "antd";
import "./Upload.scss";

export default function Upload(props) {
  const inputRef = useRef();
  const openFile = (files) => {
    const promises = [];
    [...files].forEach((e) => {
      console.log(e);
      const promise = new Promise((resolve, reject) => {
        const fr = new FileReader();
        const regExp = new RegExp(`${props.accept}$`);
        if (!e.name.match(regExp)) {
          return reject("filename");
        }
        const name = e.name.replace(regExp, "");
        fr.onload = (e) => {
          try {
            const result = e.target.result;
            const data = JSON.parse(result);
            resolve({
              name,
              data,
            });
          } catch (err) {
            reject(err);
          }
        };
        fr.readAsText(e);
      });
      promises.push(promise);
    });
    if (promises.length > 0) {
      Promise.all(promises)
        .then((e) => {
          props.setImportData(e);
          message.success("Файлы загружены успешно");
        })
        .catch((err) => {
          if (err === "filename") {
            message.error("Неподдерживаемый формат файла");
          } else {
            console.error(err);
            message.error("Ошибка при загрузке файлов");
          }
        });
    }
  };

  return (
    <div className="Upload" onClick={(e) => inputRef.current.click()}>
      <input
        type="file"
        id="file-selector"
        accept={props.accept}
        onChange={(e) => openFile(e.target.files)}
        ref={inputRef}
        multiple={true}
      ></input>
    </div>
  );
}
