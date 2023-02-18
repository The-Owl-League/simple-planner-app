import logo from './logo.svg';
import './App.css';
import { Component } from "react";
import {useCookies, withCookies} from 'react-cookie'


function AppHeader () {
    return (
        <header className="App-header">
            <div className="header-container">
                <div className="header-element">
                    Главная
                </div>
                <div className="header-element">
                    Проекты
                </div>
                <div className="header-element selected">
                    Задачи
                </div>
            </div>
        </header>
    )
}


function fmtDate(date) {

}

class TasksListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            TimerID: null,
            user_id: props.user_id,
            project_id: props.project_id,
            status: props.status
        }
    }

    updateContentRequest(user_id) {

        const request = new XMLHttpRequest();
        request.open('GET', `http://127.0.0.1:8000/v1/tasks?user_id=${user_id}`, true, );
        request.responseType = 'json'
        request.onload = () => {
            let result = [];
            result = request.response
            this.setState({
                tasks: result,
            })
        }
        request.send(null);
    }

    componentDidMount() {
        this.updateContentRequest(this.state.user_id)

        let timerID = setInterval(() => this.updateContentRequest(this.state.user_id), 1000);
        this.setState({
            TimerID: timerID
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.TimerID)
    }

    render() {
        let result = []
        this.state.tasks.forEach((i) => {

            let date = new Date(i.deadline);
            let date_string = date.toLocaleDateString("ru-RU")

            result.push(
                <div className="task-item">
                    <div className="task-header">
                        <div className="task-tittle">
                            <b>{i.title}</b>
                            <img className="edit-icon" src="https://s3-alpha-sig.figma.com/img/dfa0/8eac/615f7e87efd5eb8dca3a9a6004db9f14?Expires=1677456000&Signature=AgkGjymeQN8-qxrRhMEb4thEsNmaGXRcisC2~X-Iu6l~3LY2RXsNn1sjh7NpuxKsAMBGQ1Ss~RPmzRSv0tFY3rA~9A2AzuuQcq9M1P7OKTAkHIG~bjYLT5oGrxzFOOwGtD1YWrt1IeLe1-311WQq9iUeHmGRvXi7QnI-bmUyU1ht-qOAohrQ4bin9GnKRE1ETKmITwZFT4DSFh-ochcnE1stpyM-KSFw3T1qvWOp0prAEseFIDxfTmOotn-lrS5u58FF-5K8Z76UO22TlGg2i00~sp3kyWXzWNOD70vh-FE0bBXdoWpT5Jhz9qkf0JkFAoZ2Ej4z1rw55KhtUcDkwg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" alt="edit"/>
                        </div>
                    </div>
                    <div className="task-body">
                        <div className="task-text">
                            {i.text}
                        </div>
                    </div>
                    <div className="task-footer">
                        <div className="task-majority">
                            <b>{i.majority}</b>
                        </div>
                        <div className="task-deadline">
                            до {date_string}
                        </div>
                    </div>

                </div>
            )
        })
        return result
    }
}


class TaskFoldersComponent extends Component {
    constructor(props) {
        super(props);
    }
}


function TasksPage(props) {
    return (
            <div className="task-list">
                <TasksListComponent user_id={props.user_id} />
            </div>
    );
}


function App() {
    const [cookies, setCookie] = useCookies(['user_id'])
    setCookie("user_id", "5")   // legacy

    return (
    <div className="App">
        <AppHeader />
        <TasksPage user_id={cookies.user_id} />
    </div>
  );
}

export default App;
