import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface FlightInfo {
  on_time: string | number,
  change_time: string | number,
  destination_jp: string | number,
  destination_en: string | number,
  flight_number: string | number,
  terminal: string | number,
  gate: string | number,
  flight_status: string | number,
  [key: number]: string | number
}

class FlightData {
  flightsData: FlightInfo[] = [];
  static base_url = 'https://tokyo-haneda.com/app_resource/flight/data/';
  static proxy = 'https://blooming-lowlands-21185.herokuapp.com/';
  static filename = 'hdacfdep.json';
  
  getFlightsData() : FlightInfo[] {
    return this.flightsData;
  }

  setFlightsData(flightData: FlightInfo): void{
    this.flightsData.push(flightData);
  }

  paddingDigits(num: number): string{
    let numstr = num + "";
    if(numstr.length === 1){
        numstr = "0" + numstr;
    }
    return numstr;
  }

  getFlight(url: string) {
    const AxiosInstance = axios.create();
    AxiosInstance.get(url)
    .then(
        response => {
            const json = response.data;
            console.log(json);

            if(json.flight_end === true){
                console.log("Today's flight is ended");
                return;
            }

            for(let i of json.flight_info){
                let timeEst = new Date(i.定刻).getTime();
                let timeChn = new Date(i.変更時刻).getTime();
                let timeRea = 0;
                if(isNaN(timeChn)) timeRea = timeEst;
                else timeRea = timeChn;
                let nowTime = new Date().getTime();

                if(timeRea < nowTime) continue;

                let onTime_Date = new Date(i.定刻);
                let onTime_Hours = onTime_Date.getHours();
                let onTime_Minutes = onTime_Date.getMinutes();
                let onTime_str = this.paddingDigits(onTime_Hours) + ":" + this.paddingDigits(onTime_Minutes);

                let chTime_Date = new Date(i.変更時刻);
                let chTime_Hours = chTime_Date.getHours();
                let chTime_Minutes = chTime_Date.getMinutes();
                let chTime_str = "";
                if(!isNaN(chTime_Hours) && !isNaN(chTime_Minutes)){
                    chTime_str = this.paddingDigits(chTime_Hours) + ":" + this.paddingDigits(chTime_Minutes);
                }
                let flightData: FlightInfo = {
                    on_time: onTime_str,
                    change_time: chTime_str, 
                    destination_jp: i.行先地空港和名称,
                    destination_en: i.行先地空港英名称,
                    flight_number: i.航空会社[0].ＡＬコード + i.航空会社[0].便名,
                    terminal: i.ターミナル区分,
                    gate: i.ゲート和名称,
                    flight_status: i.備考和名称};
                this.setFlightsData(flightData);
            }
        }
    )
    .catch(console.error);
  }

  getDomesticFlight() {
    const url_dms = FlightData.proxy + FlightData.base_url + 'dms/' + FlightData.filename;
    this.getFlight(url_dms);  
  }

  getInternationalFlight(){
    const url_int = FlightData.proxy + FlightData.base_url + 'int/' + FlightData.filename; 
    this.getFlight(url_int);
  }
}

class FlightTable extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>定刻</th>
            <th>変更</th>
            <th colSpan={2}>行先</th>
            <th>便名</th>
            <th>ターミナル</th>
            <th>搭乗口</th>
            <th>運行状況</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>18:25</td>
            <td>18:40</td>
            <td>福岡</td>
            <td>Fukuoka</td>
            <td>JAL 0355</td>
            <td>1</td>
            <td>19</td>
            <td>出発済み</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default class FlightBoard extends React.Component {
  fd_dom: FlightData = new FlightData();
  fd_int: FlightData = new FlightData();
  constructor(props: React.FC){
    super(props);
    this.fd_dom.getDomesticFlight();
    this.fd_int.getInternationalFlight();
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <FlightTable />
        </header>
      </div>
    );
  }
}