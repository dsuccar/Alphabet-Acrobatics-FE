import React from 'react';
import { connect } from 'react-redux';

import './App.css';
import Signin from './components/sign-In/Signin'
import NewUser from './components/sign-In/NewUser'
import NavBar from './components/NavBar';
import SelectCharCont from './components/character_selection/SelectRapperScreen'
import BattleContainer from './components/battle/BattleContainer'
import EndGame from './components/EndGame'
import WinnerEndGame from './components/WinnerEndGame'
import { Route, withRouter, Switch } from 'react-router-dom'
import { setUser, logout } from './store/userSlice'
import { fetchRappers, selectRapper } from './store/rappersSlice'




class App extends React.Component {

 // when page loads it gets collection of bosses and rappers
  componentDidMount(){
    this.props.fetchRappers()
  }


/**
this only gets called when a rapper hits 0
Creates log of the battle
Setting state after post call to send the userinformation to the end game screen
 **/
endGame = (bossRapper,userRapper) => {
  console.log("endgame BossRapper", bossRapper, "user", userRapper)
  if (bossRapper === 0) {

  const userWon =  {

  user_id: this.props.user.id,
  boss_id: this.props.bossRapper.id,
  winner_id: this.props.user.id
  }
    fetch("http://localhost:3000/battles", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userWon)
    })


    this.props.history.push('/winner_end_game')

  } else if (userRapper <= 0){
   this.props.history.push('/end_game')
}
}

  render() {
    return (

      <div className="App">
             <NavBar
              user={this.props.user}
              handleLogout={() => this.props.logout()}
              />   
           <Switch>
                <Route exact
                        path='/'
                        render={()=>{

                      return <Signin
                      setUser={this.props.setUser} />
                      }} />

                <Route
                exact
                path='/new_user'
                render={()=>{
                  return <NewUser
                            user={this.props.user}
                            setUser={this.props.setUser}
                            />}}
                          />

                <Route
                exact
                path='/select_rapper'
                render={()=>{
                  return <SelectCharCont
                            rapperList={this.props.rapperList}
                            selectRapper={this.props.selectRapper}
                            />}}
                        />

                <Route exact path='/battle' render={()=>{
                      return <BattleContainer
                                bossRapper={this.props.bossRapper}
                                selectedRapper={this.props.selectedRapper}
                                user = {this.props.user}
                                endGame = {this.endGame}/>}}
                  />
                <Route exact path='/winner_end_game' render={()=>{
                     return <WinnerEndGame
                                selectedRapper={this.props.selectedRapper}
                                bossRapper={this.props.bossRapper}/>}}
                 />

                <Route exact path='/end_game' render={()=>{
                     return <EndGame
                                selectedRapper={this.props.selectedRapper}
                                bossRapper={this.props.bossRapper}/>}}
                 />


              </Switch>
      </div>



    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  rapperList: state.rappers.list,
  bossRapper: state.rappers.boss,
  selectedRapper: state.rappers.selected
})

const mapDispatchToProps = {
  setUser,
  logout,
  fetchRappers,
  selectRapper
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
