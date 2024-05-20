import { Button, Table, Select, DatePicker, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TodoModal from "./TodoModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface TodoItem {
  id: number;
  activity: string;
  status: string;
  CompleteBy: string;
  startedDate: string;
  startedTime: string;
  completedDate: string;
  completedTime: string;
}

const TodoComponent: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<TodoItem[]>([]);
  const [currentItem, setCurrentItem] = useState<TodoItem | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    showAll();
  }, []);

  const onChange = async (value: string) => {
    setStatus(value);
    const params: { status?: string } = {};
    if (value !== "") {
      params.status = value;
    }
    setPagination((prevState) => ({ ...prevState, current: 1 }));
    axios
      .post("http://localhost:5555/listItems/readAll", { page: 1, ...params })
      .then((response) => {
        const { todos, totalCount } = response.data;
        setData(todos);
        setPagination((prevState) => ({ ...prevState, total: totalCount }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleOk = async (data: TodoItem) => {
    try {
      const reqBody = { activity: data.activity, CompleteBy: data.CompleteBy };
      if (!currentItem) {
        await axios.post("http://localhost:5555/listItems/create", reqBody);
      } else {
        await axios.post(
          `http://localhost:5555/listItems/update/${data.id}`,
          data
        );
      }
      setVisible(false);
      showAll();
    } catch (error) {
      console.error("Error handling to-do:", error);
    }
  };

  const showAll = async (page = 1) => {
    try {
      setLoading(true);
      axios
        .post("http://localhost:5555/listItems/readAll", { page })
        .then((res) => {
          const { todos, totalCount } = res.data;
          setData(todos);
          setPagination((prev) => ({
            ...prev,
            current: page,
            total: totalCount,
          }));
        });
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateValidation = async () => {
    if (status && startDate && endDate && startDate < endDate) {
      axios
        .post(
          `http://localhost:5555/listItems/byDate/${status}/${startDate.toISOString()}/${endDate.toISOString()}`
        )
        .then((res) => {
          const { totalCount } = res.data;
          setData(res.data);
          setPagination((prevState) => ({ ...prevState, total: totalCount }));
        })
        .catch((error) => {
          console.error("Error filtering by date:", error);
        });
    }
  };

  const saveFile = async () => {
    let fileName = prompt("Enter the file name:") || "table.xlsx";
    if (!fileName.endsWith(".xlsx")) {
      fileName += ".xlsx";
    }
    let allData: TodoItem[] = [];

    const fetchPageData = async (page: number) => {
      const response = await axios.post(
        "http://localhost:5555/listItems/readAll",
        {
          page,
        }
      );
      const { todos } = response.data;
      allData = allData.concat(todos);
      if (todos.length === pagination.pageSize) {
        await fetchPageData(page + 1);
      }
    };

    setLoading(true);
    await fetchPageData(1);

    const worksheetData = [
      Object.keys(allData[0]),
      ...allData.map((row) => Object.values(row)),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, fileName);
    console.log({ allData });
    setLoading(false);
  };

  const columns = [
    { title: "S.No", dataIndex: "id", key: "id" },
    { title: "Activity", dataIndex: "activity", key: "activity" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Complete By", dataIndex: "CompleteBy", key: "CompleteBy" },
    { title: "Started Date", dataIndex: "startedDate", key: "startedDate" },
    { title: "Started Time", dataIndex: "startedTime", key: "startedTime" },
    {
      title: "Completed Date",
      dataIndex: "completedDate",
      key: "completedDate",
    },
    {
      title: "Completed Time",
      dataIndex: "completedTime",
      key: "completedTime",
    },
    {
      title: "Actions",
      render: (item: TodoItem) => (
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

  const dropdownOptions = [
    { value: "", label: "ALL" },
    { value: "open", label: "OPEN" },
    { value: "inprogress", label: "IN PROGRESS" },
    { value: "completed", label: "COMPLETED" },
  ];

  return (
    <div>
      <Button onClick={saveFile}>Save as File</Button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Select
          defaultValue=""
          style={{ width: 130 }}
          showSearch
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={filterOption}
          options={dropdownOptions}
        />
        <DatePicker value={startDate} onChange={(date) => setStartDate(date)} />
        <DatePicker value={endDate} onChange={(date) => setEndDate(date)} />
        <Button onClick={handleDateValidation}>Submit</Button>
      </div>

      <TodoModal
        visible={visible}
        setVisible={setVisible}
        handleOk={handleOk}
        currentItem={currentItem}
      />

      <div>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={pagination}
            onChange={(pagination) => showAll(pagination.current)}
          />
        )}
      </div>
    </div>
  );
};

export default TodoComponent;
