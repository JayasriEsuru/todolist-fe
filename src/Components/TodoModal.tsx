import { Input, Modal } from "antd";
import React, { useEffect, useState } from "react";

export interface TodoModalProps {
  visible: boolean;
  setVisible: any;
  handleOk: any;
  currentItem?: any;
}

interface DataInterface {
  activity?: string;
  CompleteBy?: string;
  status?: string;
  startedDate?: string;
  startedTime?: string;
  id?: string;
  completedDate?: string;
  completedTime?: string;
}

const defaultData = {
  activity: "",
  CompleteBy: "",
  status: "",
  id: "",
  startedDate: "",
  startedTime: "",
  completedDate: "",
  completedTime: "",
};

const TodoModal: React.FC<TodoModalProps> = ({
  visible,
  setVisible,
  handleOk,
  currentItem,
}) => {
  const [updatedData, setUpdatedData] = useState<DataInterface | null>(
    defaultData
  );
  // const [data, setData] = useState<DataInterface | null>(null);

  useEffect(() => {
    if (currentItem) {
      if (currentItem?.status === "open") {
        setUpdatedData({ ...currentItem, status: "inprogress" });
      } else {
        setUpdatedData({ ...currentItem, status: "completed" });
      }
    }
  }, [currentItem]);

  const onOkClick = () => {
    if (
      updatedData?.activity !== "" &&
      updatedData?.CompleteBy &&
      updatedData?.CompleteBy !== ""
    ) {
      handleOk(updatedData);
      setUpdatedData(null);
    }
  };

  const onInputChange = (e: any, key: string) => {
    setUpdatedData({ ...updatedData, [key]: e.target.value });
  };

  return (
    <Modal
      title={currentItem ? "Update Todo" : "Create Todo"}
      open={visible}
      onOk={onOkClick}
      onCancel={() => {
        setVisible(false);
        setUpdatedData(null);
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          margin: "25px",
          marginLeft: "20%",
          width: "50%",
        }}
      >
        <label style={{ width: "30%" }}>Activity:</label>
        <Input
          placeholder="Enter Activity"
          value={updatedData?.activity}
          onChange={(e) => onInputChange(e, "activity")}
          disabled={currentItem}
        />
      </div>

      {updatedData?.status ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            margin: "25px",
            marginLeft: "20%",
            width: "50%",
          }}
        >
          <label style={{ width: "30%" }}>Status:</label>
          <Input
            value={updatedData?.status}
            onChange={(e) => onInputChange(e, "status")}
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            margin: "25px",
            marginLeft: "20%",
            width: "50%",
          }}
        >
          <label style={{ width: "30%" }}>Complete by Date:</label>
          <Input
            type="date"
            placeholder="Enter Date"
            value={updatedData?.CompleteBy}
            onChange={(e) => onInputChange(e, "CompleteBy")}
          />
        </div>
      )}

      {updatedData?.status === "inprogress" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              margin: "25px",
              marginLeft: "20%",
              width: "50%",
            }}
          >
            <label style={{ width: "30%" }}>Started Date:</label>
            <Input
              type="date"
              placeholder="Enter Start Date"
              value={updatedData?.startedDate}
              onChange={(e) => onInputChange(e, "startedDate")}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              margin: "25px",
              marginLeft: "20%",
              width: "50%",
            }}
          >
            <label style={{ width: "30%" }}>Started Time:</label>
            <Input
              type="time"
              placeholder="Enter Start Time"
              value={updatedData?.startedTime}
              onChange={(e) => onInputChange(e, "startedTime")}
            />
          </div>
        </>
      )}

      {updatedData?.status === "completed" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              margin: "25px",
              marginLeft: "20%",
              width: "50%",
            }}
          >
            <label style={{ width: "30%" }}>Completed Date:</label>
            <Input
              type="date"
              placeholder="Enter Completed Date"
              value={updatedData?.completedDate}
              onChange={(e) => onInputChange(e, "completedDate")}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              margin: "25px",
              marginLeft: "20%",
              width: "50%",
            }}
          >
            <label style={{ width: "30%" }}>Completed Time:</label>
            <Input
              type="time"
              placeholder="Enter Completed Time"
              value={updatedData?.completedTime}
              onChange={(e) => onInputChange(e, "completedTime")}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default TodoModal;
