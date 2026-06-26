import React from 'react'
import { Image, Grid } from 'semantic-ui-react'

export default class UserCard extends React.Component {
  // constructor(){
  //   super()
  //   this.state = {
  //     randomLyric: null
  //   }
  // }



//   randomLyric = () => {
//   if (this.props.rapperLyrics != null) {
//      return  this.props.rapperLyrics[Math.floor(Math.random() * this.props.rapperLyrics.length)]
//   }

// }
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

 
 render() {
    return (
    
      <div>
         {!this.props.userRapperInfo.myTurn ?
         <Grid>
       <Grid.Row>
       <Grid.Column style={this.theirTurnStyle}>
       <Image src={this.props.userRapperInfo.gif} style={{padding: "40px"}}centered></Image>
        <h1>{this.props.userRapperInfo.name}</h1>
        <Image.Group>
        {[...Array(this.props.userRapperInfo.lives).keys()].map( (heart) => <Image src={"/Images/heart-sprite.png"} key={heart} size='mini'/> )}
        </Image.Group>
       </Grid.Column>
 
     </Grid.Row>
     </Grid>
      :
      <Grid>
      <Grid.Row style={this.boarderStyle}>
      <Grid.Column style={this.myTurnStyle}>
      <Image src={this.props.userRapperInfo.gif} style={{padding: "40px"}} centered ></Image>
        <h1>{this.props.userRapperInfo.name}</h1>
        <Image.Group>
        {[...Array(this.props.userRapperInfo.lives).keys()].map( (heart) => <Image src={"/Images/heart-sprite.png"} key={heart} size='mini'/> )}
        </Image.Group>
      </Grid.Column>
      </Grid.Row>
      </Grid>
      }
      </div>
        
    );
  }

}
