import React from 'react';

import './App.css';
import Signin from './components/sign-In/Signin'
import NewUser from './components/sign-In/NewUser'
import NavBar from './components/NavBar';
import SelectCharCont from './components/SelectCharCont'
import BattleContainer from './components/battle/BattleContainer'
import EndGame from './components/EndGame'
import WinnerEndGame from './components/WinnerEndGame'
import { Route, withRouter, Switch } from 'react-router-dom'


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      rapperList: [],
      bossRapper: null,
      selectedRapper: null
    }
  }

 // when page loades it gets collection of bosses and rappers
  componentDidMount(){
// collection of bosses
    fetch('http://localhost:3000/rappers')
    .then(resp => resp.json())
    .then(rappers => {
      this.setState({
        rapperList: rappers.filter(rap => rap.isboss === false)
      })
    })

// collection of user rappers
    fetch('http://localhost:3000/rappers')
    .then(resp => resp.json())
    .then(rappers => {
      this.setState({
        bossRapper: rappers.find(rap=> rap.isboss===true)
      })
    })
  }


  // Log in with existing user: if username is in database and password matches then it sets user
  // NEEDS TO BE MOVED TO BE
  submitUser = (user) => {

     fetch("http://localhost:3000/users")
      .then(resp => resp.json())
      .then(allUsers =>
        allUsers.forEach(pastUser => {
          
           if(pastUser.username === user.username && pastUser.password === user.password) {
      this.setState({user: pastUser})
      this.props.history.push(`/select_rapper`)
      
        } 
      })
    )

  }
// updates new user
setUser = (user) => {
  this.setState({ user })
}
        

  selectRapper = (rapper) =>{
    
    const userObj = {
      artist_id: rapper.id,
      username: this.state.user.username,
      password: this.state.user.password,
      // badges:'wind' 
    }
    
    fetch(`http://localhost:3000/users/${this.state.user.id}`)
      .then(response => response.json())
      .then( 
        this.setState({
        selectedRapper: rapper
      }))
    

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

  user_id: this.state.user.id,
  boss_id: this.state.bossRapper.id,
  winner_id: this.state.user.id
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

 handleLogout = (event) => {
    this.setState({userData: null})

  }

  render() {
    return (

      <div className="App">
             {<NavBar user={this.state.user} logout={this.handleLogout} state={this.state}/>}
             <Switch>
                <Route exact path='/' render={()=>{
                      return <Signin submitUser={this.submitUser}/>}}
                  />

                <Route 
                exact 
                path='/new_user' 
                render={()=>{
                  return <NewUser 
                            user={this.state.user}
                            setUser={this.setUser}
                            />}}
                          />
                
                <Route 
                exact 
                path='/select_rapper' 
                render={()=>{
                  return <SelectCharCont 
                            rapperList={this.state.rapperList}
                            selectRapper={this.selectRapper}
                            />}}
                        />

                <Route exact path='/battle' render={()=>{
                      return <BattleContainer 
                                bossRapper={this.state.bossRapper}   
                                selectedRapper={this.state.selectedRapper}
                                user = {this.state.user}
                                endGame = {this.endGame}/>}}
                  />
                <Route exact path='/winner_end_game' render={()=>{
                     return <WinnerEndGame 
                                selectedRapper={this.state.selectedRapper}
                                bossRapper={this.state.bossRapper}/>}} 
                 />

                <Route exact path='/end_game' render={()=>{
                     return <EndGame 
                                selectedRapper={this.state.selectedRapper}
                                bossRapper={this.state.bossRapper}/>}} 
                 />
                  
                  
              </Switch>
      </div>



    );
  }
}

export default withRouter(App);
