import React from 'react'
import { Card, Image } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

 class RapperCard extends React.Component {
  constructor(){
    super()
    this.state = {
      selectedRapper: ''
    }

  }


    handleClick = (test) => {
      this.props.selectRapper(this.props.rapper)
      this.props.history.push("battle")

    }


    l

  render(){
    // debugger
    return(
      <div style={{padding: "50px"}}>
   <Card onClick={this.handleClick}  centered>
      <Card.Content>
      <Image src={this.props.rapper.gif} centered ></Image>
      <Card.Header>{this.props.rapper.name}</Card.Header>
          <Card.Description>
          <div>
             <p>{this.props.rapper.hometown}</p>
          </div>
          </Card.Description>
      </Card.Content>
  </Card>
  </div>

    )
  }

}
export default withRouter(RapperCard)