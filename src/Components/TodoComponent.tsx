import { Button, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TodoModal from "./TodoModal";

const TodoComponent = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  const showModal = () => {
    setVisible(true);
    setCurrentItem(null);
  };

  useEffect(() => {
    showAll(); // Fetch data when component mounts
  }, []);

  const handleOk = (data: any) => {
    const reqBody = { activity: data.activity, CompleteBy: data.CompleteBy };
    if (!currentItem) {
      axios
        .post("http://localhost:5555/listItems/create", reqBody)
        .then((response) => {
          setVisible(false);
          showAll();
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error creating to-do:", error);
        });
    } else {
      axios
        .post(`http://localhost:5555/listItems/update/${data.id}`, data)
        .then((response) => {
          setVisible(false);
          setCurrentItem(null);
          showAll();
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error creating to-do:", error);
        });
    }
  };

  const showAll = () => {
    axios
      .post("http://localhost:5555/listItems/readAll")
      .then((response) => {
        setData(response.data); // Update component state with fetched data
      })
      .catch((err) => {
        console.log(err); // Log any errors that occur during the fetch
      });
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "activity",
      dataIndex: "activity",
      key: "activity",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "CompleteBy",
      dataIndex: "CompleteBy",
      key: "CompleteBy",
    },
    {
      title: "startedDate",
      dataIndex: "startedDate",
      key: "startedDate",
    },
    {
      title: "startedTime",
      dataIndex: "startedTime",
      key: "startedTime",
    },
    {
      title: "completedDate",
      dataIndex: "completedDate",
      key: "completedDate",
    },
    {
      title: "completedTime",
      dataIndex: "completedTime",
      key: "completedTime",
    },
    {
      render: (item: any) => (
        <Button
          onClick={() => {
            setVisible(true);
            setCurrentItem(item);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        style={{ marginLeft: "45%", marginTop: "50px" }}
        onClick={showModal}
      >
        Create A TO DO
      </Button>
      <TodoModal
        visible={visible}
        setVisible={setVisible}
        handleOk={handleOk}
        currentItem={currentItem}
      />
      <Table dataSource={data} columns={columns} />
    </>
  );
};

export default TodoComponent;
