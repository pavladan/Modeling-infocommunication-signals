import React, { useEffect, useState } from "react";
import {
  Table,
  InputNumber,
  Button,
  Typography,
  Row,
  Col,
  Tooltip,
} from "antd";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { MathFieldComponent } from "react-mathlive";

export default function TableMode(props) {
  const [singleLeap, setSingleLeap] = useState(
    props.leaps.filter((l) => l.fraquency === undefined)
  );
  const [modulatedLeap, setModulatedLeap] = useState(
    props.leaps.filter((l) => l.fraquency !== undefined)
  );

  useEffect(() => {
    props.setLeaps([...singleLeap, ...modulatedLeap]);
  }, [singleLeap, modulatedLeap]);

  return (
    <Row>
      <Col>
        <Row align="middle" gutter={8}>
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Single Leap
            </Typography.Title>
          </Col>
          <Col>
            <Tooltip
              title={
                <MathFieldComponent
                  latex="f\mleft(t\mright)=\begin{cases} 0, t<\tau  \\ A, t\ge \tau\end{cases}"
                  mathFieldConfig={{
                    defaultMode: "math",
                    ignoreSpacebarInMathMode: false,
                    readOnly: true,
                  }}
                />
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
        </Row>

        <EditableTable
          data={singleLeap}
          setData={setSingleLeap}
          dataTemplate={[
            { id: "amplitude", value: 1 },
            { id: "delay", value: 0 },
          ]}
          columnNames={[
            { id: "amplitude", name: "Amplitude [A]" },
            { id: "delay", name: "Delay [τ], μs", min: 0 },
          ]}
        />
      </Col>
      <Col>
        <Row align="middle" gutter={8}>
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Modulated Leap
            </Typography.Title>
          </Col>
          <Col>
            <Tooltip
              title={
                <MathFieldComponent
                  latex="f\mleft(t\mright)=\begin{cases}0,t<\tau  \\ A\cos \mleft(\omega t+\frac{\varphi _0\cdot \pi }{180}\mright),t\ge \tau \end{cases}"
                  mathFieldConfig={{
                    defaultMode: "math",
                    readOnly: true,
                  }}
                />
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
        </Row>

        <EditableTable
          data={modulatedLeap}
          setData={setModulatedLeap}
          dataTemplate={[
            { id: "amplitude", value: 1 },
            { id: "delay", value: 0 },
            { id: "fraquency", value: 1 },
            { id: "phase", value: 0 },
          ]}
          columnNames={[
            { id: "amplitude", name: "Amplitude [A]" },
            { id: "delay", name: "Delay [τ], μs", min: 0 },
            { id: "fraquency", name: "Fraquency [ω], MGhz", min: 0 },
            { id: "phase", name: "Initial phase [φ], grad" },
          ]}
        />
      </Col>
    </Row>
  );
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  min,
  ...restProps
}) => {
  const save = async (e) => {
    handleSave({ ...record, [dataIndex]: e });
  };

  let childNode = children;

  if (editable) {
    childNode = (
      <InputNumber
        value={record[dataIndex]}
        parser={(e) => {
          if (e.slice(-1) === ",") return e.slice(0, -1) + ".";
          return e;
        }}
				onPressEnter={(e) => e.target.blur()}
        onChange={(e) => {
          if (
            typeof e === "number" &&
            e >= (min !== undefined ? min : -Infinity)
          ) {
            save(e);
          } else if (e === null) save(0);
        }}
        style={{ width: "100%" }}
      />
    );
  }

  return <td {...restProps} >{childNode}</td>;
};

const EditableTable = (props) => {
  const handleDelete = (key) => {
    props.setData((oldDataSource) =>
      oldDataSource.filter((item) => item.key !== key)
    );
  };

  const handleAdd = () => {
    const count = props.data.length;
    const newData = {
      key: count,
    };
    props.dataTemplate.forEach((v, i) => {
      newData[v.id] = v.value;
    });

    props.setData((oldDataSouce) => [...oldDataSouce, newData]);
  };

  const handleSave = (row) => {
    props.setData((oldDataSouce) => {
      const newData = [...oldDataSouce];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      return newData;
    });
  };

  const components = {
    body: {
      cell: EditableCell,
    },
  };
  const columns = props.columnNames.map((n, i) => ({
    title: n.name,
    dataIndex: n.id,
    editable: true,
    ellipsis: "true",
    min: n.min,
    onCell: (record) => ({
      record,
      editable: true,
      title: n.name,
      dataIndex: n.id,
      ellipsis: "true",
      handleSave: handleSave,
      min: n.min,
    }),
  }));

  columns.push({
    title: "",
    dataIndex: "operation",
    width: 40,
    align: "right",
    render: (text, record) =>
      props.data.length >= 1 ? (
        <Button
          icon={<CloseOutlined />}
          type="default"
          shape="circle"
          size="small"
          onClick={(e) => handleDelete(record.key)}
        ></Button>
      ) : null,
  });

  return (
    <div>
      <Table
        tableLayout="fixed"
        components={components}
        rowClassName={() => "editable-row"}
        dataSource={props.data}
        columns={columns}
        pagination={false}
        scroll={{ y: 200 }}
        size="small"
        locale={{ emptyText: <span></span> }}
      />
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          margin: "16px 0",
        }}
      >
        Add
      </Button>
    </div>
  );
};
