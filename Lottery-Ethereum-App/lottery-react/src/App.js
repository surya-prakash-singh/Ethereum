import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
  Alert,
  Spin,
  InputNumber,
  Form,
  Descriptions,
  Divider,
  Comment,
  Avatar,
  Button
} from "antd";

import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";


function AppWrapped(props) {
  const { getFieldDecorator } = props.form;
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [etherEntered, setEtherEntered] = useState(0);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const makeAsync = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };
    makeAsync();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (etherEntered) {
      try {
        const accounts = await web3.eth.getAccounts();
        setLoader(1);
        await lottery.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei(`${etherEntered}`, "ether")
        });
        setLoader("exists");
      } catch (err) {
        setLoader(false);
        alert("Transaction rejected");
      }
    }
  };

  const pickWinnerButton = async () => {
    try{
    const accounts = await web3.eth.getAccounts();
    setLoader("winnerTry");
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setLoader("winnerSelected");
    }catch(err){
      setLoader(false);
      alert('error');
    }
  };

  return (
    <div className="lottery--app-container">
      <section className="header">
        <Comment
          author="Lottery Application"
          avatar={
            <Avatar src="https://media.licdn.com/dms/image/C4D03AQESWL8mCg8wwQ/profile-displayphoto-shrink_200_200/0?e=1582156800&v=beta&t=QQeRNdQjC4KPaCOynYT6g-NJ-0LtuJl6yBWio6ypeqQ">
              {"Lottery Application"}
            </Avatar>
          }
          content={<p></p>}
        />
        <Divider />
        <div className="manager-text">
          Manager Address:- <em>{manager}</em>{" "}
        </div>
        <Divider />

        <Descriptions title="Contract Info">
          <Descriptions.Item label="Manager">
            This contract is managed by {manager}
          </Descriptions.Item>
          <Descriptions.Item label="Players">
            There are currently {players.length} people entered,They are
            competing to win {web3.utils.fromWei(`${balance}`, "ether")} ether!
          </Descriptions.Item>
        </Descriptions>

        <Divider />
        <h2 className="label-form">Want to Try your Luck!!</h2>

        <Form layout="inline" onSubmit={e => handleSubmit(e)}>
          <Form.Item label="Amount of ether to enter">
            {getFieldDecorator("input-number", { initialValue: 1 })(
              <InputNumber onChange={value => setEtherEntered(value)} min={0} />
            )}
            <span className="ant-form-text"> ether</span>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        <Divider />
        {loader === 1 && (
          <Spin tip="Transaction in Progress...">
            <Alert
              message="Transaction in Progress"
              description="Connecting to Ethereum Network"
              type="info"
            />
          </Spin>
        )}
        {loader === "exists" && (
          <Alert
            message="Transaction Completed"
            description="You are now part of this contest"
            type="success"
          />
        )}

        <Divider />
        <h1>
          Pick a Winner If you are a manager only this transaction will go
          throught
        </h1>
        <Button type="danger" onClick={() => pickWinnerButton()}>
          PickWinner
        </Button>
        <Divider />

        {loader === "winnerTry" && (
          <Spin tip="Transaction in Progress...">
            <Alert
              message="Transaction in Progress"
              description="Connecting to Ethereum Network"
              type="info"
            />
          </Spin>
        )}
        {loader === "winnerSelected" && (
          <Alert
            message="Winner Has been Picked"
            description="Check Your Balance Now"
            type="success"
          />
        )}
      </section>
    </div>
  );
}
const App = Form.create({ name: "validate_other" })(AppWrapped);

export default App;
