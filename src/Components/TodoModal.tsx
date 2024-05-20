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

  console.log({ updatedData });

  useEffect(() => {
    if (currentItem) {
      if (currentItem?.status === "open") {
        setUpdatedData({ ...currentItem, status: "inprogress" });
      } else {
        setUpdatedData({ ...currentItem, status: "completed" });
      }
    }
  }, [currentItem]);

  let condition = updatedData?.activity !== "" && updatedData?.CompleteBy;
  const condition1 =
    updatedData?.status === "inprogress" &&
    updatedData?.startedDate &&
    updatedData?.startedTime;
  const condition2 =
    updatedData?.status === "completed" &&
    updatedData?.completedDate &&
    updatedData?.completedTime;

  if (updatedData?.status === "inprogress") {
    condition = condition1;
  }
  if (updatedData?.status === "completed") {
    condition = condition2;
  }

  const onOkClick = () => {
    if (condition) {
      handleOk(updatedData);
      setUpdatedData(null);
    }
  };

  const onInputChange = (e: any, key: string) => {
    const { value } = e.target;

    if (
      key === "startedTime" &&
      updatedData?.completedDate === updatedData?.startedDate &&
      updatedData?.completedTime &&
      value > updatedData?.completedTime
    ) {
      setUpdatedData({ ...updatedData, [key]: updatedData?.completedTime });
    } else if (
      key === "completedTime" &&
      updatedData?.startedDate === updatedData?.completedDate &&
      updatedData?.startedTime &&
      value < updatedData?.startedTime
    ) {
      setUpdatedData({ ...updatedData, [key]: updatedData?.startedTime });
    } else {
      // Otherwise, update the time normally
      setUpdatedData({ ...updatedData, [key]: value });
    }
  };

  return (
    <Modal
      title={currentItem ? "Update Todo" : "Create Todo"}
      open={visible}
      onOk={onOkClick}
      onCancel={() => {
        setVisible(false);
        setUpdatedData(null);
        // window.location.reload();
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
            min={new Date().toISOString().split("T")[0]}
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
              max={updatedData?.CompleteBy}
              min={new Date().toISOString().split("T")[0]}
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
              max={updatedData?.CompleteBy}
              min={updatedData?.startedDate}
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
