import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface OverlayProps {
  setSelectedColumn: React.Dispatch<
    React.SetStateAction<
      {
        pageNo: number;
        selectedColumn: number;
      }[]
    >
  >;
}

const Overlay: React.FC<OverlayProps> = ({ setSelectedColumn }) => {
  const [value, setValue] = useState<string>("");

  const submitHandler = () => {
    let arr: { pageNo: number; selectedColumn: number }[] = [];
    let newValue = Math.floor(parseInt(value) / 12 + 1);

    const fetchData = () => {
      let arr: { pageNo: number; selectedColumn: number }[] = [];
      for (let i = 0; i < newValue; i++) {
        arr.push({
          pageNo: i + 1,
          selectedColumn:
            newValue - 1 === i
              ? parseInt(value) % 12 === 0
                ? 12
                : parseInt(value) % 12
              : 12,
        });
      }
      return arr;
    };
    arr = fetchData();
    setSelectedColumn(arr);
    setValue("");
  };

  return (
    <div
      style={{
        padding: "15px",
        background: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "250px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <InputText
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />
      <Button
        label="Submit"
        type="button"
        onClick={submitHandler}
        style={{
          backgroundColor: "#007bff",
          color: "#ffffff",
          padding: "10px 15px",
          fontSize: "14px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
      />
    </div>
  );
};

export default Overlay;
