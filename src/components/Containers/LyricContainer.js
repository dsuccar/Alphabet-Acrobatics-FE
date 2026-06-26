import React from 'react'
import {Grid ,Button, Input } from 'semantic-ui-react'

export default class LyricCard extends React.Component {
  constructor() {
    super()
    this.state = {
      randomLyric: null,
      answer: "",
      i: 0,
       b: 0
    }

  }



  randomLyric = () => {
  
 console.log(this.state.i,this.state.b)
    const lyricArray = this.props.lyrics
    

    // if user turn
    if (this.props.userInfo.myTurn === true){
      // where i get the lyric from
    let lyric = lyricArray[this.state.i]
// every time i pull a lyric it adds a tick and goes down one in the array
     this.setState({
       randomLyric: lyric,
       i: this.state.i + 1,
       b: this.state.b 
     })
     

    } else if (this.props.bossInfo.myTurn === true){
      let lyric = lyricArray[this.state.b]
       this.setState({
         randomLyric: lyric,
         b: this.state.b +1,
         i: this.state.i
       })
 

      }

   
  }

  handleChangeAnswer = (event) => {
   
  if (this.props.bossInfo.myTurn === true){
      this.setState({
        answer: event.target.value.toLowerCase(),
        turn: "bossTurn"
      })} else {
        this.setState({
          answer: event.target.value.toLowerCase(),
          turn: "userTurn"
        })
      }
  
    }

  
    
  
    submitAnswerAndClear = (event) => {
event.preventDefault()
    if (!!this.state.answer.trim() === false){
      this.setState({
        error: "try again",
        randomLyric: this.state.randomLyric
      })
     
     
    } else {
      this.props.onHandleSubmitAnswer(this.state.randomLyric.answer,this.state.answer, this.state.turn,event)
      
      this.setState({
        randomLyric: null,
        answer: "",
        error: "",
        b: this.state.b ,
         i: this.state.i
      })
      
}
    }
  render(){
    
    
        return(
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
    
        {!this.state.randomLyric
        ?
      
        <Button onClick={this.randomLyric}>click here to get lyric
        </Button>
    
        :
        <div>
          <h1>
            {this.state.randomLyric.text}
          </h1>
          <form onSubmit={ event => {this.submitAnswerAndClear(event)}} >
            <Input name="answer" 
            placeholder="Lyric..." 
            onChange={this.handleChangeAnswer} 
            />
            <h3>Song: {this.state.randomLyric.song}</h3>
            <h5 style={{textColor: "red"}}>{this.state.error}</h5>

            <button type="submit">
            Submit
          </button>
          </form>
        </div>
    
    
      }
      </Grid.Column>
  </Grid.Row>
      </Grid>
      

  

    )
  }

}
