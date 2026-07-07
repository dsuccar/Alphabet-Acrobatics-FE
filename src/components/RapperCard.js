import React from 'react'
import { Card, Image } from 'semantic-ui-react'

 class RapperCard extends React.Component {

    highlightStyle = {
      border: '4px solid #db4848',
      boxShadow: '0 0 20px rgba(219, 72, 72, 0.8)'
    }

    handleClick = () => {
      this.props.onSelect(this.props.rapper)
    }

  render(){
    return(
      <div style={{padding: "50px"}}>
   <Card onClick={this.handleClick} centered style={this.props.isSelected ? this.highlightStyle : undefined}>
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
export default RapperCard
