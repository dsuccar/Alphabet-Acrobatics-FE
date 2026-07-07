import React from 'react'
import RapperCard from '../components/RapperCard'
import { Grid, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'


 class SelectCharCont extends React.Component {
  constructor(){
    super()
      this.state = {
        searchTerm: '',
        selectedRapper: null
      }

  }

  handleSelectRapper = (rapper) => {
    this.setState({ selectedRapper: rapper })
  }

  beginBattle = () => {
    this.props.selectRapper(this.state.selectedRapper)
    this.props.history.push('/battle')
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

  bioBoxStyle = {
    background: 'rgba(20, 20, 20, 0.92)',
    border: '4px solid #db4848',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '24px',
    minHeight: '300px'
  }

  render(){
    const { selectedRapper } = this.state
    return(
      <div style={this.backgroundStyle} className="course-image">
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={12}>
              <Grid>
                <Grid.Row columns={3}>
                {this.props.rapperList.map(rapper =>

                <Grid.Column key={rapper.id} style={this.selectCharStyle}>
                  <RapperCard
                  rapper={rapper}
                  isSelected={!!selectedRapper && selectedRapper.id === rapper.id}
                  onSelect={this.handleSelectRapper}
                />
                  </Grid.Column>
                  )}
                </Grid.Row>
                <Grid.Row centered>
                  <Button
                    primary
                    size='huge'
                    disabled={!selectedRapper}
                    onClick={this.beginBattle}
                  >
                    Begin Battle
                  </Button>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={4}>
              <div style={this.bioBoxStyle}>
                {selectedRapper
                  ? <div>
                      <h2>{selectedRapper.name}</h2>
                      <p>{selectedRapper.bio}</p>
                    </div>
                  : <div>
                      <h2>Alphabet Aerobics</h2>
                      <p>Know every bar. Beat every rapper. Become the GOAT.</p>
                    </div>
                }
              </div>
            </Grid.Column>
          </Grid.Row>
      </Grid>
    </div>
    )
  }

}

export default withRouter(SelectCharCont)
