import React from 'react'
import { Button, Grid, Image, Header } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'

class EndGame extends React.Component {

  selectNew = () => {
    this.props.history.push('/select_rapper')
  }
  tryAgain = () => {
    this.props.history.push('/battle')
  }
  logout = () => {
    this.props.history.push('/')
  }
  fightNextBoss = () => {
    this.props.advanceBoss()
    this.props.history.push('/battle')
  }
render(){
  console.log(this.props)
  return(
    <div>
        <Button primary onClick={this.tryAgain}>Try again?</Button>
        <Button primary onClick={this.selectNew}>Select New Rapper</Button>
        {this.props.hasNextBoss &&
          <Button primary onClick={this.fightNextBoss}>Skip to Next Boss</Button>
        }
        <Button secondary onClick={this.logout}>Logout?</Button>
        <Grid>

      <Grid.Row >
        {/* <Grid.Column></Grid.Column> */}
        <Grid.Column verticalAlign='middle'>
        <Header as='h1'>1st Place! Congratulations,{this.props.bossRapper.name}!</Header>
       <Image src={this.props.bossRapper.gif} style={{padding: "100px"}} centered ></Image>

        </Grid.Column>
        </Grid.Row>
        <Grid.Row >
        <Grid.Column verticalAlign='middle'>
        <h5>2nd Place, #YouAreWhatYouListenTo {this.props.selectedRapper.name}.</h5>
        <Image src={this.props.selectedRapper.gif} centered ></Image>

        </Grid.Column>
        </Grid.Row>
        </Grid>

    </div>
  )
}}
export default withRouter(EndGame);
// this.props.history.push('/end_game')
