import React, { Component } from 'react'
// import { Button, Checkbox, Form } from 'semantic-ui-react'
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom';


class Signin extends Component {

  constructor() {
    super()
    this.state = {
      username: "",
      password: "",
      allUsers: [],
      error:''
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }


  handleSubmit = (event) => {
    event.preventDefault()

      const user = {
          username: this.state.username,
          password: this.state.password
        }

    fetch("http://localhost:3000/users")
      .then(resp => resp.json())
      .then(allUsers =>
        allUsers.forEach(pastUser => {
          
           if( pastUser.username === user.username && 
            pastUser.password === user.password) {
              
      this.props.setUser({pastUser})
      this.props.history.push(`/select_rapper`)
          } else {
            this.setState({error : "The username or password you've entered is incorrect."})
          }
      })
    )

  
  
    this.setState({ username: "", password: "" })
  }

  guestSubmit = (event) => {
    event.preventDefault()
    const user = {
      username: "guest",
      password: "123456"
    }
    
    this.props.setUser(user)
    this.props.history.push(`/select_rapper`)
   
    this.setState({ username: "", password: "" })
  }

  signIn = {
    paddingTop: "50px"
  }
  render() {
    console.log(this.state)
    return (
      <div>
      
      <Grid columns='equal' style={this.signIn}>
        
    <Grid.Column >
    </Grid.Column>
    
    <Grid.Column  >
 
    <h4> Sign in to keep track of wins, or continue on as a guest below to get right to the action</h4>
      <Segment>
        <Segment placeholder >
        <Grid columns={2}  >
          
          <Grid.Column >
          <h1>Sign In:</h1>
            <Form>
              <Form.Input
                placeholder='Log In' 
                name='username' 
                type='text' 
                onChange={this.handleChange} 
                value={this.state.username}
              />
              <Form.Input
              placeholder='password' 
              name='password' type='text' 
              onChange={this.handleChange} 
              value={this.state.password}
            />
      
              <Button 
              content='submit' 
              value='Sign In' 
              onClick={this.handleSubmit} />
            </Form>
          </Grid.Column>
    
          <Grid.Column verticalAlign='middle'>
            
            <Button 
            content='New User' 
            icon='signup' 
            size='big' 
            as={Link} 
            to="/new_user"/>
          </Grid.Column>
        </Grid>
    
        <Divider vertical>Or</Divider>
      </Segment>
      <h5>{this.state.error}</h5>
      </Segment>
    </Grid.Column>
    <Grid.Column>
      
    </Grid.Column>
    <Grid.Row></Grid.Row>
  </Grid>
  {!!this.state.user? null :
    <Button content='Continue as Guest' onClick={this.guestSubmit} />}
  </div>
    )
  }
} 
export default withRouter(Signin)