import React from 'react'
import RapperCard from './RapperCard'
import { Grid } from 'semantic-ui-react'


 export default class SelectCharCont extends React.Component {
  constructor(){
    super()
      this.state = {
        searchTerm: ''
      }
    
  }


    
  

  selectCharStyle = {
    paddingTop: "12px"
  }

  backgroundStyle=
  {backgroundImage: `url('${'/images/selectcharbackground.jpg'}')`,
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover', 
  padding: 100,
  height: 1000}

  render(){
    return(
      <div style={this.backgroundStyle} className="course-image">
        <Grid>  
          <Grid.Row columns={3}>
          {this.props.rapperList.map(rapper => 
          
          <Grid.Column key={rapper.id} style={this.selectCharStyle}>
            <RapperCard 
            
            rapper={rapper}
            selectRapper={this.props.selectRapper}
          />
            </Grid.Column>
            )}      
          </Grid.Row>     
      </Grid>
    </div>
    )
  }

}
