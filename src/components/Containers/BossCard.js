import React from 'react'
import {  Grid, Image } from 'semantic-ui-react'

export default class BossCard extends React.Component {

  

  myTurnStyle = {
    border: "8px solid",
    borderColor: "#db4848",
    minHeight: "560px",
    padding: "40px 0px"
  }
  theirTurnStyle = {
    minHeight: "560px",
    padding: "40px 0px"
  }
  boarderStyle = {
    padding: "0px 0px"
  }

  render(){
    // console.log(this.props.bossRapperInfo.lives)
// 
    return(
      <div>

   <Grid>
     <Grid.Row style={this.boarderStyle}>
      <Grid.Column style={this.myTurnStyle}>
      <Image src={this.props.bossRapperInfo.gif} centered ></Image>
        <h1>{this.props.bossRapperInfo.name}</h1>
      <Image.Group>
      {[...Array(this.props.bossRapperInfo.lives).keys()].map( (heart) => <Image src={"/Images/heart-sprite.png"} key={heart} size='mini'/> )}
        </Image.Group>
   </Grid.Column>
   </Grid.Row>
   </Grid>

   </div>
     

    )
  }

}
