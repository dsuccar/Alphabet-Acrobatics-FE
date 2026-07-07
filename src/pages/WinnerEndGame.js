import React from 'react'
import { Button, Card, Header, Image } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'

class WinnerEndGame extends React.Component {

  pageStyle = {
    backgroundImage: `url('/images/Background.jpg')`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    minHeight: '100vh',
    padding: '60px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }

  cardStyle = {
    background: 'rgba(20, 20, 20, 0.92)',
    border: '4px solid #db4848',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
    maxWidth: '480px',
    width: '100%'
  }

  headerStyle = { color: '#fff' }
  subHeaderStyle = { color: '#db4848', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '20px' }
  buttonRowStyle = { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }

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
    <div style={this.pageStyle}>
      <Card centered style={this.cardStyle}>
        <Card.Content style={{ textAlign: 'center', border: 'none' }}>
          <Header as='h1' style={this.headerStyle}>1st Place! Congratulations, {this.props.selectedRapper.name}</Header>
          <Image src={this.props.selectedRapper.gif} style={{ padding: '20px 0' }} centered ></Image>

          <h5 style={this.subHeaderStyle}>2nd Place, {this.props.bossRapper.name}?</h5>
          <Image src={this.props.bossRapper.gif} style={{ padding: '20px 0' }} centered ></Image>
        </Card.Content>
        <Card.Content extra style={{ border: 'none' }}>
          <div style={this.buttonRowStyle}>
            {this.props.hasNextBoss
              ? <Button primary onClick={this.fightNextBoss}>Fight Next Boss!</Button>
              : <Button primary onClick={this.selectNew}>Select New Rapper</Button>
            }
            <Button secondary onClick={this.logout}>Logout?</Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
}
export default withRouter(WinnerEndGame);
