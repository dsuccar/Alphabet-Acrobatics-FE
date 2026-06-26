import React from 'react'
import { Button, Grid, Header, Image } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'

class WinnerEndGame extends React.Component {

  selectNew = () => {
    this.props.history.push('/select_rapper')
  }
  logout = () => {
    this.props.history.push('/')
  }
  fightNextBoss = () => {
    this.props.advanceBoss()
    this.props.history.push('/battle')
  }

render(){
  return (
    <div>
      <Grid>

      <Grid.Row >

        <Grid.Column verticalAlign='middle'>
        <Header as='h1'>1st Place!  Congratulations, {this.props.selectedRapper.name}</Header>
       <Image src={this.props.selectedRapper.gif} style={{padding: "100px"}} centered ></Image>

        </Grid.Column>
        </Grid.Row>
        <Grid.Row >
        <Grid.Column verticalAlign='middle'>
        <h5 >2nd Place, {this.props.bossRapper.name}?</h5>
       <Image src={this.props.bossRapper.gif} centered ></Image>

        </Grid.Column>
        </Grid.Row>
        </Grid>

      {this.props.hasNextBoss
        ? <Button primary onClick={this.fightNextBoss}>Fight Next Boss!</Button>
        : <Button primary onClick={this.selectNew}>Select New Rapper</Button>
      }
        <Button secondary onClick={this.logout}>Logout?</Button>
    </div>
  )
}
}
export default withRouter(WinnerEndGame);
