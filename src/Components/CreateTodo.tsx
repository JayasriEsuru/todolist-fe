import { Button, Input, message } from "antd";
import axios from "axios";
import React, { useState } from "react";

interface TodoItem {
  activity: string;
  CompleteBy: string;
}

const CreateTodo = () => {
  const [activity, setActivity] = useState("");
  const [completeBy, setCompleteBy] = useState("");

  const onButtonClick = () => {
    console.log("activity:", activity);
    console.log("Complete By Date:", completeBy);

    if (!activity || !completeBy) {
      message.error("Please fill out all required fields.");
      return;
    }

    const reqBody: TodoItem = {
      activity: activity,
      CompleteBy: completeBy,
    };

    axios
      .post("http://localhost:5555/listItems/create", reqBody)
      .then((res) => {
        console.log("Response:", res.data);
        setActivity("");
        setCompleteBy("");
        message.success("Todo created successfully.");
      })
      .catch((error) => {
        console.error("Error creating todo:", error);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <h1>Create Todo</h1>
      <div>
        <label style={{ width: "30%", marginRight: "20px" }}>activity:</label>
        <Input
          type="text"
          style={{ width: "40%" }}
          placeholder="Enter activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
      </div>
      <div>
        <label style={{ width: "30%", marginRight: "20px" }}>
          Complete By Date
        </label>
        <Input
          type="date"
          style={{ width: "40%" }}
          placeholder="Select Date"
          value={completeBy}
          onChange={(e) => setCompleteBy(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <Button
        type="primary"
        style={{ width: "20%", marginLeft: "40%" }}
        onClick={onButtonClick}
      >
        Ok
      </Button>
    </div>
  );
};

export default CreateTodo;
