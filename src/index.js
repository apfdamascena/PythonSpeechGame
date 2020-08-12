import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './Components/HomePage/HomePage'
import OptionPage from './Components/OptionPage/OptionPage';
import GamePage from './Components/GamePage/GamePage';
import data from './dataJSON';
import LoginPage from './Components/LoginPage/LoginPage';
import NewUserPage from './Components/NewUserPage/NewUserPage';
import fire from './FireBase/FireBase';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AboutPage from './Components/AboutPage/AboutPage';
import RankingPage from './Components/RankingPage/RankingPage';

const STATE = {
    HomePage: 0,
    LoginPage: 1,
    OptionPage: 2,
    GamePage: 3,
    NewUser: 4,
    AboutPage: 5,
    RankingPage: 6
}

const DATA = data

const ASK = {
    "CLASSES": "ARE YOU ABLE TO IMPLEMENT?",
    "STRUCTURES": "RECORD WHILE YOU READ:",
    "CONTROL FLOW": "ARE YOU ABLE TO IMPLEMENT?",
    "FUNCTIONS": "   HOW WOULD YOU IMPLEMENT?"
}


class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.numberAsk = 0;
        this.state = {
            appState: STATE.HomePage,
            choosenState: ""
        }
    }

    getRandomNumber = (min, max) => {
        return parseInt(Math.random() * (max - min) + min);
    }


    createNewUser = () => {this.setState({ appState: STATE.NewUser });}
    didTapAboutPage = () => {this.setState({ appState: STATE.AboutPage });}
    goToLoginPage = () => {this.setState({ appState: STATE.LoginPage });}
    didTapLoginButton = () => {this.setState({ appState: STATE.OptionPage });}
    didChooseSection = (section) => {this.setState({ appState: STATE.GamePage, choosenState: section });}
    didTapRanking = () => {this.setState({appState: STATE.RankingPage});}
    didTapGoBackGamePage = () => { this.setState({appState: STATE.GamePage});}

    didTapNext = () => {
        this.numberAsk = this.getRandomNumber(0, DATA[this.state.choosenState].length);
        this.setState({ appState: STATE.GamePage });
    }


    didTapRegister = () => {
        fire.auth().signOut().then( () => {
        }).catch((error) => {
            console.log(error);
        });
        this.setState({ appState: STATE.LoginPage });
    }


    didTapGoBackOption = () => {
        confirmAlert({
            title: 'Confirm to exit the game.',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.setState({appState : STATE.OptionPage})
              },
              {
                label: 'No',
                onClick: () => console.log("don't want")
              }
            ]
        });
    }

    didTapGoBack = () => {
        confirmAlert({
            title: 'Confirm to leave.',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => fire.auth().signOut().then(() => {
                                console.log("sign out")
                                this.setState({ appState: STATE.HomePage });
                                }).catch((error) => {
                                    console.log(error);
                                })
              },
              {
                label: 'No',
                onClick: () => console.log("don't want")
              }
            ]
          });
    }

    maybeRenderHomePage() {
        if (this.state.appState == STATE.HomePage) {
            return (
                <div>
                    <HomePage didTapPlayButton={this.goToLoginPage} />
                </div>
            );
        }
    }

    maybeRenderNewUserPage() {
        if (this.state.appState == STATE.NewUser) {
            return (
                <div>
                    <NewUserPage didTapRegister={this.didTapRegister} />
                </div>
            );
        }
    }

    maybeRenderLoginPage() {
        if (this.state.appState == STATE.LoginPage) {
            return (
                <div>
                    <LoginPage didTapLoginButton={this.didTapLoginButton}
                        createNewUser={this.createNewUser}
                        didTapGoBack={this.didTapGoBack}
                        didTapAboutPage={this.didTapAboutPage}
                    />
                </div>
            );
        }
    }

    maybeRenderOptionPage() {
        if (this.state.appState == STATE.OptionPage) {
            return (
                <div>
                    <OptionPage didTapSection={this.didChooseSection} didTapGoBack={this.didTapGoBack} />
                </div>
            );
        }
    }

    maybeRenderGamePage() {
        if (this.state.appState == STATE.GamePage) {
            return (
                <div>
                    <GamePage
                        content={DATA[this.state.choosenState][this.numberAsk]}
                        question={ASK[this.state.choosenState]}
                        name={this.state.choosenState}
                        data={DATA[this.state.choosenState]}
                        didTapRanking = {this.didTapRanking}
                        didTapGoBackOption={this.didTapGoBackOption}
                        didTapNext={this.didTapNext}>
                    </GamePage>
                </div>
            );
        }
    }

    maybeRenderAboutPage() {
        if (this.state.appState == STATE.AboutPage) {
            return (
                <div>
                    <AboutPage didTapBackLogin={this.goToLoginPage} />
                </div>
            );
        }
    }

    maybeRenderRankingPage(){
        if(this.state.appState == STATE.RankingPage){
            return (
                <div>
                    <RankingPage didTapGoBackGamePage = {this.didTapGoBackGamePage}/>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.maybeRenderHomePage()}
                {this.maybeRenderLoginPage()}
                {this.maybeRenderAboutPage()}
                {this.maybeRenderNewUserPage()}
                {this.maybeRenderOptionPage()}
                {this.maybeRenderGamePage()}
                {this.maybeRenderRankingPage()}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);