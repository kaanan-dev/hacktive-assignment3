import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import {DatePicker} from 'antd'
import TableData from './components/table';
import Currency from './components/currency';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Currency></Currency>
      </header>
    </div>
  );
}

export default App;
