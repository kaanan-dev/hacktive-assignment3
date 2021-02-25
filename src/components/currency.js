import axios from "axios";
import {Row, Col, Space, Table, Card, Input, Select} from 'antd';
import { useEffect, useState } from 'react';

const TableData = (props) => {

    return (
        <Table dataSource={props.dataSource} columns={props.columns}/>
    )
}

const Currency = () => {
  
    const { Option } = Select

    const columns = [
        {
            title: '',
            dataIndex:'currencyName'
        },
        {
            title: 'BUY',
            dataIndex:'buy'
        },
        {
            title: 'EXCHANGE',
            dataIndex:'exchange'
        },
        {
            title: 'SELL',
            dataIndex:'sell'
        },
    ]
    const [rawData, setRawData] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [InputValue, setInputValue] = useState();
    const [currency, setCurrency] = useState(false);
    const [select, setSelect] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await axios.get("https://api.exchangeratesapi.io/latest");
            if(res.status !== 200) return;

            const data = res?.data;
            if(data){
                console.log('data', data);
                setRawData(data);
                renderSelect(data);
            }
        })();
    }, []);

    useEffect(() =>{
     defineDataSource(rawData, processor);
      console.log(dataSource);
    }, [rawData, currency, InputValue]);

    const defineDataSource = (data, func) => {
        let ds = [];
        if(!data.rates) return;
        let ratesKeys =  Object.keys(data.rates);
        for(let i = 0; i < ratesKeys.length; i++){
            let key = ratesKeys[i];
            let rates = data.rates[key];
            ds.push({
                    key : i,
                    currencyName:key,
                    buy: profit(rates, "buy"),
                    exchange: rates,
                    sell : profit(rates, "sell")})
        }
        ds = func(ds);
        setDataSource(ds);
    }

    const profit = (rates, type) => {
            if(!rates) return 0;
            if(!type) return 0;
            switch(type){
                case "buy":
                    return rates*1.1;
                case "sell":
                    return rates*0.9;
            }
            return rates;
    }
    const processor = (datatable) => {
        if (!datatable) return;
        if(!currency) return nullify(datatable);
        if(!InputValue) return nullify(datatable);

        let excRate = rawData.rates[currency];
        return datatable.map((v, i) => {
            let exchangeRate = excRate / v.exchange;
            const convert = (val) => round(profit(InputValue*exchangeRate, val));
            return {
                key : v.key,
                currencyName : v.currencyName,
                buy : convert("buy"),
                exchange : round(exchangeRate),
                sell : convert("sell")
            }
        })
    }

    const nullify = (datatable) => {
        if (!datatable) return;
        return datatable.map((v, i) => ({
            key : v.key,
            currencyName : v.currencyName,
            buy : 0,
            exchange : 0,
            sell :0
        }))
    }
    const round = (val) => {
        return val.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    }

    const onchangeInput = (e) => {
        console.log(e.target);
        if(e.target.value) setInputValue(e.target.value);
    }
    const onChangeCurrency = (e) => {
        console.log(e);
        setCurrency(e);
    }
    const renderSelect = (data) => {
        if(!data.rates) return;
        setSelect(
            <Select defaultValue="Select Currency" onChange={onChangeCurrency} style={{width : 100}}>
                {Object.keys(data.rates).map((val,index) => 
                    (
                        <Option value={val}>{val}</Option>
                    )
                )}
            </Select>
        )

        }

    return (
        <Row>
            <Col lg={{span: 12, offset:1}}>
                <Space direction="vertical">
                    <Card title="Currency Table" style={{width: 800}}>
                        <Input
                        addonBefore={select}
                        onChange={onchangeInput}
                        value={InputValue}
                        disabled={!currency}
                        placeholder="Please Input Here..."
                        >
                        </Input>
                        {dataSource && (
                            <TableData dataSource={dataSource} columns={columns}/>
                        )}
                       
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}


export default Currency;