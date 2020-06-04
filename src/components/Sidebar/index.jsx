import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Row,
  Col,
  Select,
  Divider,
  Tooltip,
  List,
  Popover,
  Popconfirm,
} from "antd";
import {
  PlusCircleFilled,
  EyeFilled,
  EyeInvisibleFilled,
  EditFilled,
  DownloadOutlined,
  DeleteFilled,
  SettingFilled,
  LineChartOutlined,
  MinusOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { ChromePicker } from "react-color";
import SignalEdit from "../SignalEdit";
import ChainEdit from "../ChainEdit";
import CalcSettings from "../CalcSettings";
import getRandomColor from "../../helpers/getRandomColor";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Sidebar(props) {
  const [chains, setChains] = useState([
    {
      name: "ФНЧ С05-50-50",
      id: "c0",
      variables: {
        Cz: 38.37555614,
        N1: 1,
        N2: 2,
        N3: 0,
        N4: 2,
        a1s: { "1": 0.333895562 },
        a2e: { "1": 0.206618944, "2": 0.05270029 },
        a3x: {},
        a4y: { "1": 0, "2": 0 },
        w2e: { "1": 0.708416409, "2": 0.992817444 },
        w4y: { "1": 1.94802866, "2": 1.348138999 },
      },
    },
    {
      name: "ПФ С05-50-50",
      id: "c1",
      variables: {
        Cz: 76.75111227,
        N1: 0,
        N2: 5,
        N3: 1,
        N4: 4,
        a1s: {},
        a2e: {
          "1": 0.060674138,
          "2": 0.042635334,
          "3": 0.016349126,
          "4": 0.010001019,
          "5": 0.08347389,
        },
        a3x: { "1": 0 },
        a4y: { "1": 0, "2": 0, "3": 0, "4": 0 },
        w2e: {
          "1": 1.191391538,
          "2": 0.837183333,
          "3": 1.278467384,
          "4": 0.782058662,
          "5": 0.996509965,
        },
        w4y: {
          "1": 1.599291292,
          "2": 0.625276962,
          "3": 1.392303636,
          "4": 0.718234137,
        },
      },
    },
  ]);
  const [chain, setChain] = useState();

  const [signalEditOpen, setSignalEditOpen] = useState(false);
  const [chainEditOpen, setChainEditOpen] = useState(false);
  const [calcSettingsOpen, setClacSettingsOpen] = useState(false);
  const [centralFraq, setCentralFraq] = useState(6);

  useEffect(() => {
    props.setForceGetData(false);
    if (!signalEditOpen) {
      props.setForceGetData(true);
    }
  }, [signalEditOpen]);
  const editChain = (newChain) => {
    setChains((old) => {
      if (newChain.id !== undefined) {
        return old.map((s) => {
          if (s.id === newChain.id) {
            return newChain;
          }
          return s;
        });
      } else {
        const ids = old.map((s) => s.id);
        const newId = props.genNewId(ids, "c");
        setChain(newId);
        return [...old, { ...newChain, id: newId }];
      }
    });
  };

  const signalOptions = props.signals.map((s) => (
    <Option value={s.id} key={s.id} title={s.name}>
      <Row style={{ flexWrap: "nowrap" }}>
        <Col>
          <div
            className="color"
            style={{
              backgroundColor: s.color,
              borderRadius: "50%",
              width: 18,
              height: 18,
              marginRight: 6,
            }}
          ></div>
        </Col>
        <Col flex="auto" style={{ overflow: "hidden", marginRight: 5 }}>
          {s.name}
        </Col>
        <Col>
          <span
            className="showIcon"
            style={{ cursor: "pointer" }}
            onClick={(e) => props.toggleShowSignal(e, s.id)}
          >
            {
              <Button
                shape="circle"
                size="small"
                icon={s.show ? <EyeFilled /> : <EyeInvisibleFilled />}
              />
            }
          </span>
        </Col>
      </Row>
    </Option>
  ));
  const chainOptions = chains.map((s) => (
    <Option value={s.id} key={s.id} title={s.name}>
      {s.name}
    </Option>
  ));

  const deleteChain = (_) => {
    setChains((old) => {
      const newChains = old.filter((s) => s.id !== chain);
      const lastChain = newChains[newChains.length - 1];
      setChain(lastChain ? lastChain.id : undefined);
      return newChains;
    });
  };

  const calculate = () => {
    if (!props.signal || !chain) {
      return;
    }
    const curSignal = props.signals.find((e) => e.id === props.signal);
    const curChain = chains.find((e) => chain === e.id);
    props.addResult({
      name: `${curSignal.name} / ${curChain.name} (${centralFraq} МГц)`,
      show: true,
      color: getRandomColor(),
      initial: {
        type: "result",
        signal: { ...curSignal },
        chain: curChain.variables,
        centralFraq,
      },
    });
  };

  const saveSignal = () => {
    const cur = props.signals.find((e) => e.id === props.signal);
    const blob = new Blob([JSON.stringify(cur.initial)], {
      type: "application/json",
    });
    saveAs(blob, cur.name + ".sg");
	};
	const increaseName = (oldName)=>{
		let newName;
    const indexName = +oldName.slice(-1);
    if (!Number.isNaN(indexName)) {
      newName = oldName.slice(0, -1) + (indexName + 1);
    } else {
      newName = oldName + " 2";
		}
		return newName
	}
  const cloneSignal = (origSignal) => {
    const newName = increaseName(origSignal.name)
    props.editSignal({
      ...origSignal,
      id: undefined,
      name: newName,
      color: getRandomColor(),
      show: true,
    });
  };
  const cloneChain = (origChain) => {
		const newName = increaseName(origChain.name)
    editChain({
      ...origChain,
      id: undefined,
      name: newName,
    });
  };
  const saveChart = () => {
    const cur = chains.find((e) => chain === e.id);
    const blob = new Blob([JSON.stringify(cur.variables)], {
      type: "application/json",
    });
    saveAs(blob, cur.name + ".zv");
  };
  return (
    <div
      className="Sidebar"
      style={{
        ...props.style,
        height: "100vh",
        padding: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="Signals">
        <Row gutter={8}>
          <Col>
            <Title level={2} style={{ color: "var(--text)" }}>
              Сигналы
              <Tooltip placement="right" title="Добавить новый сигнал">
                <Button
                  shape="circle"
                  size="default"
                  type="default"
                  style={{ padding: 0, marginLeft: 10 }}
                  icon={<PlusCircleFilled style={{ fontSize: 30 }} />}
                  onClick={(_) => setSignalEditOpen(true)}
                ></Button>
              </Tooltip>
            </Title>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto" style={{ width: 45 }}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Выберите сигнал"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={props.signal}
              onChange={props.setSignal}
              notFoundContent={null}
              optionLabelProp="title"
            >
              {signalOptions}
            </Select>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Изменить сигнал">
              <Button
                disabled={props.signal === undefined}
                shape="circle"
                onClick={(_) =>
                  setSignalEditOpen(
                    props.signals.find((s) => s.id == props.signal)
                  )
                }
                icon={<EditFilled />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Дублировать сигнал">
              <Button
                disabled={props.signal === undefined}
                shape="circle"
                onClick={(_) =>
                  cloneSignal(props.signals.find((s) => s.id == props.signal))
                }
                icon={<CopyOutlined />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Скачать сигнал">
              <Button
                disabled={props.signal === undefined}
                shape="circle"
                icon={<DownloadOutlined />}
                onClick={saveSignal}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Удалить сигнал">
              <Popconfirm
                title="Удалить выбранный сигнал ?"
                onConfirm={props.deleteSignal}
                cancelText="Отмена"
              >
                <Button
                  disabled={props.signal === undefined}
                  shape="circle"
                  icon={<DeleteFilled />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </Col>
        </Row>
      </div>
      <Divider style={{ flex: "0 0 auto" }} />
      <div className="Chains">
        <Row gutter={8}>
          <Col>
            <Title level={2} style={{ color: "var(--text)" }}>
              Звенья
              <Tooltip placement="right" title="Добавить новое звено">
                <Button
                  shape="circle"
                  size="default"
                  type="default"
                  style={{ padding: 0, marginLeft: 10 }}
                  icon={<PlusCircleFilled style={{ fontSize: 30 }} />}
                  onClick={(_) => setChainEditOpen(true)}
                ></Button>
              </Tooltip>
            </Title>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto" style={{ width: 45 }}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Выберите звено"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={chain}
              onChange={(e) => setChain(e)}
              notFoundContent={null}
              optionLabelProp="title"
            >
              {chainOptions}
            </Select>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Изменить звено">
              <Button
                disabled={chain === undefined}
                shape="circle"
                icon={<EditFilled />}
                onClick={(_) =>
                  setChainEditOpen(chains.find((s) => s.id == chain))
                }
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Дублировать звено">
              <Button
                disabled={chain === undefined}
                shape="circle"
                icon={<CopyOutlined />}
                onClick={(_) => cloneChain(chains.find((s) => s.id == chain))}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Скачать звено">
              <Button
                disabled={chain === undefined}
                shape="circle"
                icon={<DownloadOutlined />}
                onClick={saveChart}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Удалить звено">
              <Popconfirm
                title="Удалить выбранное звено ?"
                onConfirm={deleteChain}
                cancelText="Отмена"
              >
                <Button
                  disabled={chain === undefined}
                  shape="circle"
                  icon={<DeleteFilled />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </Col>
        </Row>
      </div>
      <Divider style={{ flex: "0 0 auto" }} />
      <div className="Calc">
        <Row gutter={8}>
          <Col flex="auto">
            <Button
              type="primary"
              shape="round"
              block
              icon={<LineChartOutlined />}
              onClick={calculate}
              disabled={!props.signal || !chain}
            >
              Рассчитать
            </Button>
          </Col>
          <Col>
            <Button
              shape="circle"
              onClick={(_) => setClacSettingsOpen(true)}
              icon={<SettingFilled />}
            ></Button>
          </Col>
        </Row>
      </div>
      <div
        className="Results"
        style={{
          flex: 1,
          height: 200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Title level={2} style={{ margin: "12px 0" }}>
          Результаты
        </Title>
        <List
          style={{ flex: 1, overflowY: "auto" }}
          dataSource={props.results}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Popover
                    trigger="click"
                    placement="topLeft"
                    style={{ padding: 0 }}
                    content={
                      <div style={{ margin: "-12px -16px" }}>
                        <ChromePicker
                          color={item.color}
                          onChange={(e) =>
                            props.changeColorOnResult(item.id, e)
                          }
                          disableAlpha
                        ></ChromePicker>
                      </div>
                    }
                  >
                    <div
                      className="color"
                      style={{
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        marginLeft: 1,
                      }}
                    ></div>
                  </Popover>
                }
                title={
                  <Text
                    editable={{
                      onChange: (e) => {
                        if (e) props.setNameOnResult(item.id, e);
                      },
                    }}
                  >
                    {item.name}
                  </Text>
                }
              ></List.Item.Meta>
              <Button
                shape="circle"
                size="small"
                style={{ marginLeft: 5 }}
                icon={
                  item.show ? (
                    <EyeFilled></EyeFilled>
                  ) : (
                    <EyeInvisibleFilled></EyeInvisibleFilled>
                  )
                }
                onClick={(_) => props.toggleShowResult(item.id)}
              ></Button>
              <Button
                shape="circle"
                size="small"
                style={{ marginLeft: 5 }}
                icon={<DownloadOutlined></DownloadOutlined>}
              ></Button>
              <Button
                shape="circle"
                size="small"
                style={{ marginLeft: 5 }}
                icon={<MinusOutlined />}
                onClick={(_) => props.deleteResult(item.id)}
              ></Button>
            </List.Item>
          )}
        />
      </div>
      {signalEditOpen && (
        <SignalEdit
          signal={
            typeof signalEditOpen === "object" ? signalEditOpen : undefined
          }
          save={props.editSignal}
          visible
          close={(_) => setSignalEditOpen(false)}
        />
      )}
      {chainEditOpen && (
        <ChainEdit
          chain={typeof chainEditOpen === "object" ? chainEditOpen : undefined}
          save={editChain}
          visible
          close={(_) => setChainEditOpen(false)}
        />
      )}
      {calcSettingsOpen && (
        <CalcSettings
          centralFraq={centralFraq}
          setCentralFraq={setCentralFraq}
          visible
          close={(_) => setClacSettingsOpen(false)}
        />
      )}
    </div>
  );
}
