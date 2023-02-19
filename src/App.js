import logo from './logo.svg';
import './App.css';
import './login_style.css';
import { Component, useState } from "react";
import { useCookies, withCookies } from 'react-cookie'


const Page =  {
    MAIN: 'main',
    TASKS: 'tasks',
    PROJECT: 'projects',
    ADD_TASK: 'add_task',
    REGISTRATION: 'registration',
    FORGOT_PASSWORD: 'forgot_password',
    LOG_IN: 'log_in'
}


class PageControllerComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: Page.REGISTRATION,  // default page
            prev_page: Page.REGISTRATION,
            user_id: props.user_id,
            cookies: props.cookies
        }
        this.onClickTriggerFactory = this.onClickTriggerFactory.bind(this)
        this.changeUser = this.changeUser.bind(this)
        this.getUser = this.getUser.bind(this)
    }

    changeUser(new_user_id) {
        console.log("new user" + new_user_id)
        this.setState({
            user_id: new_user_id
        })
    }
    getUser() {
        return this.state.user_id
    }

    onClickTriggerFactory(page) {
        return () => {
            this.setState({
                prev_page: this.state.page,
                page: page
            })
        }
    }

    render() {
        let [task_class, main_class, project_class] = [
            "header-element",
            "header-element",
            "header-element"
        ];

        const ChooseContent = () => {
            switch (this.state.page) {
                case Page.MAIN:
                    return <MainPage/>
                case Page.PROJECT:
                    return <ProjectsPage/>
                case Page.TASKS:
                    return <TasksPage user_id={this.state.user_id} changePageFactory={this.onClickTriggerFactory} cookies={this.state.cookies} getUser={this.getUser}/>
                case Page.ADD_TASK:
                    const callbackUndo = this.onClickTriggerFactory(this.state.prev_page);

                    return <AddTaskPage
                        user_id={this.state.user_id}
                        callbackUndo={callbackUndo}
                    />
                case Page.REGISTRATION:
                    console.log('ok')
                    return <RegistrationPage changePageFactory={this.onClickTriggerFactory} changeUser={this.changeUser}/>
                case Page.FORGOT_PASSWORD:
                    return <ForgotPasswordPage changePageFactory={this.onClickTriggerFactory}/>
                case Page.LOG_IN:
                    return <LoginPage changePageFactory={this.onClickTriggerFactory}/>
                default:
                    return <span>Page not found error</span>
            }
        }

        let is_render_header = true;
        switch (this.state.page) {
            case Page.MAIN:
                main_class += " selected"
                break
            case Page.PROJECT:
                project_class += " selected"
                break
            case Page.TASKS:
                task_class += ' selected'
                break
            default:
                is_render_header = false;
                break
        }
        let header = <span />

        if (is_render_header) {
            header = <header className="App-header">
                <div className="header-container">
                    <div className={main_class} onClick={this.onClickTriggerFactory(Page.MAIN)}>
                        Главная
                    </div>
                    <div className={project_class} onClick={this.onClickTriggerFactory(Page.PROJECT)}>
                        Проекты
                    </div>
                    <div className={task_class} onClick={this.onClickTriggerFactory(Page.TASKS)}>
                        Задачи
                    </div>
                </div>
            </header>
        }

        return [
            header,
            <ChooseContent/>
        ]
    }
}


function AddTaskPage(props) {
    const [title, setTitle] = useState(0);
    const [text, setText] = useState(0);
    const [deadline, setDeadline] = useState(0);

    const onSubmit = (e) => {
        const request1 = new XMLHttpRequest();
        request1.open('POST', `http://185.104.248.207:6079/v1/tasks/?user_id=${props.user_id}`, true, );
        request1.responseType = 'json'
        request1.onload = () => {}
        const blob = new Blob([JSON.stringify({
            title: title,
            text: text,
            deadline: deadline,
            majority: "",
            project: ""
        }, null, 2)], {
            type: "application/json",
        });
        request1.send(
            blob
        );

        props.callbackUndo();
    }

    return (
        <div className="form-container" onSubmit={onSubmit}>
            <div className="page-back" onClick={props.callbackUndo}>Назад</div>
            <div className="form-title">Добавить задачу</div>
            <form className="form-fields-container">
                <input
                    type="text" name="title" size="40"
                    maxLength="30" required placeholder="Введите название"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="input-task-text" required placeholder="Введите текст"
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    type="text" name="deadline" size="40"
                    maxLength="30" required placeholder="Введите дедлайн"
                    onChange={(e) => setDeadline(e.target.value)}
                />
                <input type="submit" placeholder="Подтвердить"></input>
            </form>
        </div>

    )
}


function TasksListComponent (tasks) {
    /** Constructs solid list of tasks */

    let result = []
    tasks.forEach((i) => {
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


function  TaskFoldersComponent (props) {
    /** Constructs lists of tasks, filtered by project */

    let grouped_by_project = {};

    props.tasks.forEach(
        (i) => {
            if (grouped_by_project[i.project]) {
                grouped_by_project[i.project].push(i)
            } else {
                grouped_by_project[i.project] = [i]
            }
        }
    )

    let result = [];
    for (const [project_name, tasks] of Object.entries(grouped_by_project)) {
        result.push(
            <div className="tasks-group-tittle">
                <div>{project_name}</div>
                <div className="add-task" onClick={props.addTaskCallback}>
                    <b>+ задача</b>
                </div>
            </div>
        )
        result.push(
            TasksListComponent(tasks)
        )
    }

    return result
}


class TasksPage extends Component {
    constructor(props) {
        super(props);
        this.changePageFactory = props.changePageFactory
        this.state = {
            tasks_pending: [],
            tasks_done: [],
            TimerID: null,
            user_id: props.user_id,
            project_id: props.project_id,
            status: props.status,
            cookies: props.cookies,
            getUser: props.getUser
        }

    }

    updateContentRequest(user_id) {
        const request1 = new XMLHttpRequest();
        request1.open('GET', `http://185.104.248.207:6079/v1/tasks?user_id=${user_id}&status=NEW`, true, );
        request1.responseType = 'json'
        request1.onload = () => {
            this.setState({
                tasks_pending: request1.response,
            })
        }
        request1.send(null);

        const request2 = new XMLHttpRequest();
        request2.open('GET', `http://185.104.248.207:6079/v1/tasks?user_id=${user_id}&status=DONE`, true, );
        request2.responseType = 'json'
        request2.onload = () => {
            this.setState({
                tasks_done: request2.response,
            })
        }
        request2.send(null);
    }

    componentDidMount() {
        let user_id = this.state.getUser()
        this.updateContentRequest(user_id)
        console.log("actual is " + this.state.cookies.user_id)
        let timerID = setInterval(() => this.updateContentRequest(user_id), 1000);
        this.setState({
            TimerID: timerID
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.TimerID)
    }

    addTaskCallbackFactory(project_name) {
        return this.changePageFactory(Page.ADD_TASK);
    }

    render () {
        return (
            <div className="task-list">
                <div className="tasks-status-group-tittle">
                    В процессе
                </div>
                <TaskFoldersComponent
                    addTaskCallback={this.addTaskCallbackFactory()}
                    tasks={this.state.tasks_pending}
                    user_id={this.state.user_id}
                    cookes={this.state.cookies}/>
                <div className="tasks-status-group-tittle">
                    Завершённые
                </div>
                <TaskFoldersComponent
                    tasks={this.state.tasks_done}
                    user_id={this.state.user_id}
                    cookes={this.state.cookies}/>
            </div>
        )
    }
}

function MainPage(props) {
    return (
        <div>
            Main page
        </div>
    )
}


function RegistrationPage(props) {

    const [email, set_email] = useState(0);
    const [first_name, set_first_name] = useState(0);
    const [second_name, set_second_name] = useState(0);
    const [patronymic, set_patronymic] = useState(0);
    const [password, set_password] = useState(0);

    const [cookies, setCookie] = useCookies(['user_id'])

    const onSubmit = () => {
        const request1 = new XMLHttpRequest();
        request1.open('POST', `http://185.104.248.207:6079/v1/users`, true, );
        request1.responseType = 'json'
        request1.onload = () => {
            let user_id = request1.response.id;
            props.changeUser(user_id);
            props.changePageFactory(Page.MAIN)()
        }
        const blob = new Blob([JSON.stringify({
            email: email,
            first_name: first_name,
            second_name: second_name,
            patronymic: patronymic,
            password: password,
            role: "client"
        }, null, 2)], {
            type: "application/json",
        });
        request1.send(
            blob
        );


        props.callbackUndo();
    }

    return (
        <div className="main">
            <div className="reg"><h1>SimplePlanner вас приветствует!</h1></div>
            <br/>
            <div className="reg"><h2>Зарегистрируйтесь</h2></div>
            <span className="Url" onClick={props.changePageFactory(Page.LOG_IN)}>У вас уже есть аккаунт?</span>
            <div>
                <input type="text" name="first_name" size="40" maxLength="16" required placeholder="Введите фамилию" onChange={(e) => set_first_name(e.target.value)}/>
                <div className="RegBlock"><input type="text" name="second_name" size="40" maxLength="16" required
                                                 placeholder="Введите имя" onChange={(e) => set_first_name(e.target.value)}/></div>
                <div className="RegBlock"><input type="text" name="patronymic" size="40" maxLength="16" required
                                                 placeholder="Введите отчество" onChange={(e) => set_patronymic(e.target.value)}/></div>
                <div className="RegBlock"><input type="text" name="email" size="40" maxLength="16" required
                                                 placeholder="Введите email" onChange={(e) => set_email(e.target.value)}/></div>
                <div className="RegBlock"><input type="text" name="password" size="40" maxLength="16" required
                                                 placeholder="Введите пароль" onChange={(e) => set_password(e.target.value)}/></div>
                <p className="Url" onClick={props.changePageFactory(Page.FORGOT_PASSWORD)}>Забыли пароль?</p>
                <div className="RegBlock"><div onClick={onSubmit}>Подтвердить</div></div>
            </div>
        </div>
    )
}


function ForgotPasswordPage(props) {
    return [
        <div className="reg"><h1>Восстановление пароля</h1></div>,
        <form action="http://185.104.248.207:6079/v1/register_user" method="post">
            <div className="RegBlock"><input type="text" name="email" size="40" maxLength="16" required
                                             placeholder="Введите email"/></div>
        </form>,
        <p className="Url" onClick={props.changePageFactory(Page.MAIN)}>Выслать пароль</p>,
    ]
}


function LoginPage(props) {
    return [
        <div className="reg"><h1>Вход в аккаунт</h1></div>,
        <form action="http://185.104.248.207:6079/v1/register_user" method="post">
            <div className="RegBlock">
                <input type="text" name="email" size="40" maxLength="16" required
                                              placeholder="Введите email"/>
            </div>
            <div className="RegBlock">
                <input type="text" name="password" size="40" maxLength="16" required
                                              placeholder="Введите пароль"/>
            </div>
            <p className="Url" onClick={props.changePageFactory(Page.FORGOT_PASSWORD)}>Забыли пароль?</p>
            <div className="RegBlock"><input type="submit"/></div>
        </form>
    ]
}

function ProjectsPage(props) {
    return (
        <div>
            Projects page
        </div>
    )
}


function App() {
    const [cookies, setCookie] = useCookies(['user_id'])
    setCookie("user_id", "3")   // legacy

    return (
    <div className="App">
        <PageControllerComponent user_id={cookies.user_id} cookies={cookies}/>
    </div>
  );
}

export default App;
