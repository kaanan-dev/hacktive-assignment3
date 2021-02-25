import React, {Component, useEffect, useState} from  'react';
import { Row, Space, Table, Col, Card } from 'antd';
import axios from 'axios';


const TableData = () => {
        const [dataSource, setDataSource] = useState();
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address',
            },
          ];
          useEffect(() => {
            const response = axios
            .get('https://api.exchangeratesapi.io/latest')
            .then((res) => {
              return res.data.rates;
            });
            
            response.then((res) => {
                let i = 1;
                let resDT = [];
                for(let item in res) {
                  let itemRates = {
                    key: i,
                    name: item,
                    rates: res[item],
                  };
                  resDT.push(itemRates);
                  i = i + 1;
                }
                setDataSource(resDT);
            });
          }, []);
         

        return (
           <Row>
               <Col log={ {span:12, offset:2}}>
                   <Space direction="vertical">
                       <Card title="Table Chart Stock" style={{ width:900}}>
                           <Table dataSource={dataSource} columns={columns}></Table>
                       </Card>
                   </Space>
               </Col>
           </Row>
        )
    };

export default TableData; 



