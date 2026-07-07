import UserCard from '../components/Containers/UserCard'
import BossCard from '../components/Containers/BossCard'
import GuessTheLyric from './GuessTheLyric'
import React from 'react'
import { withRouter } from 'react-router-dom'

import { Grid, Segment } from 'semantic-ui-react'

class BattleContainer extends React.Component {

  constructor(){
    super()
    this.state = {
      userRapperInfo: {
        name: null,
        bio: null,
        // lives: 1,
        hometown: null,
        myTurn: null
      },
      bossRapperInfo: {
        name: null,
        bio: null,
        // lives: 1,
        hometown: null,
        myTurn: null
      },
    }

  }

  componentDidMount(){
    this._isMounted = true

    if (!this.props.user) {
      this.props.history.push('/')
      return
    }

    if (!this.props.selectedRapper || !this.props.bossRapper) {
      this.props.history.push('/select_rapper')
      return
    }

    fetch(`http://localhost:3000/rappers/${this.props.selectedRapper.id}`)
    .then(resp => resp.json())
    .then(userRapper => {
      if (this._isMounted) this.setState({
        userRapperInfo: {
          name: userRapper.name,
          bio: userRapper.bio,
          lives: userRapper.lives,
          hometown: userRapper.hometown,
          myTurn: true,
          isTrue: null,
          gif: userRapper.gif
        }
      })
    })

    fetch(`http://localhost:3000/rappers/${this.props.bossRapper.id}`)
    .then(resp => resp.json())
    .then(bossRapper => {
      if (this._isMounted) this.setState({
        bossRapperInfo: {
          name: bossRapper.name,
          bio: bossRapper.bio,
          lives: bossRapper.lives,
          hometown: bossRapper.hometown,
          myTurn: false,
          isTrue: null,
          gif: bossRapper.gif
        }
      })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }




handleGuessTheLyricCorrect = () => {
  const newLives = this.state.bossRapperInfo.lives - 1
  this.setState({
    bossRapperInfo: { ...this.state.bossRapperInfo, lives: newLives },
  })
  if (newLives <= 0) {
    this.props.endGame(newLives, this.state.userRapperInfo.lives)
  }
}

handleGuessTheLyricWrong = () => {
  const newLives = this.state.userRapperInfo.lives - 1
  this.setState({
    userRapperInfo: { ...this.state.userRapperInfo, lives: newLives }
  })
  if (newLives <= 0) {
    this.props.endGame(this.state.bossRapperInfo.lives, newLives)
  }
}

backgroundStyle=
  {backgroundImage: `url('${'/images/Background.jpg'}')`,
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
  padding: 100,
  height: 1000}


  render(){
    // console.log(this.state.userRapperInfo.name)
    return(



   <div style={this.backgroundStyle} className="course-image">
      <Grid columns='equal' >
      <Grid.Row >
      <Grid.Column>

        <Segment>

          <UserCard
              userRapperInfo={this.state.userRapperInfo}/>

          </Segment>

        </Grid.Column>
        <Grid.Column style={{padding:"-200px"}} >
          {/* Feedback if user BOSS answered correctly */}
            { this.state.bossRapperInfo.isTrue
            ?
            <Grid.Column>
              <Segment>
              <h1>✅</h1>
              </Segment>
            </Grid.Column>
          :
            <Grid.Column>
              {/* if the question is answered incorrectly show an x and the correct answer */}
              {this.state.bossRapperInfo.isTrue === null || this.state.bossRapperInfo.isTrue === undefined
              ?
              <div></div>
              :
              <Segment>
              <div>
              <h1>❌</h1>
              <h3>{this.state.questionAnswer}</h3>
              </div>
              </Segment>
              }

            </Grid.Column>
            }

        {/* Feedback if user Rapper answered correctly */}
            { this.state.userRapperInfo.isTrue
            ?
            <Grid.Column>

            <Segment>
              <h1>✅</h1>
              </Segment>
            </Grid.Column>
          :
            <Grid.Column>

              {this.state.userRapperInfo.isTrue === null || this.state.userRapperInfo.isTrue === undefined
              ?
              <div></div>
              :
              <Segment>
              <div>
              <h1>❌</h1>
              <h3>{this.state.questionAnswer}</h3>
              </div>
              </Segment>
              }

            </Grid.Column>
            }



        </Grid.Column>
        <Grid.Column>
          <Segment>
        <BossCard
            bossRapperInfo={this.state.bossRapperInfo}/>
           </Segment>
        </Grid.Column>
        </Grid.Row>



        <Grid.Row columns={2}>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <GuessTheLyric
                selectedRapper={this.state.userRapperInfo}
                lives={this.state.userRapperInfo.lives}
                onCorrectAnswer={this.handleGuessTheLyricCorrect}
                onWrongAnswer={this.handleGuessTheLyricWrong}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

      </Grid>
      </div>

  )

  }
}

export default withRouter(BattleContainer)
