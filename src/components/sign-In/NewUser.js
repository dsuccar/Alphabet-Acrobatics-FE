import React from 'react';


import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'


class NewUser extends React.Component {
  constructor() {
    super()
    this.state = {
      username: "",
      password: "",
      userExists: false
    }
  }

  
  
  handleSubmit = (event) => {
    event.preventDefault()
    const user = {
      username: this.state.username,
      password: this.state.password
    }

    
    this.props.newUser(user)


    // no idea why the following line was in here
    // this.setState({ username: "", password: "" })
  }
  
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  newUser = {
    paddingTop: "100px"
  }

  
  render() {
    console.log(this.state)
    return (

      <Grid columns='equal' style={this.newUser}>
      <Grid.Column >
        
      </Grid.Column>
      <Grid.Column >
        <Segment >
          <Segment placeholder >
          <Grid columns={2}  >
            
            <Grid.Column verticalAlign='middle'>
              <Button content='Sign In' 
              icon='sign-in' 
              size='big' 
               as={Link} 
               to="/" 
               />
            </Grid.Column>
          
          <Grid.Column >
            <h1>New User:</h1>
              <Form>
                <Form.Input
                  placeholder='Username' 
                  name='username' 
                  type='text' 
                  onChange={this.handleChange}
                />
                <Form.Input
                placeholder='password' 
                name='password' 
                type='text' 
                onChange={this.handleChange} 
              />
        
                <Button 
                content='submit' 
                value='Sign In' 
                onClick={this.handleSubmit} />
              </Form>
            </Grid.Column>
            </Grid>
          <Divider vertical>Or</Divider>
        </Segment>
        </Segment>
      </Grid.Column>
      <Grid.Column></Grid.Column>
    </Grid>

    );
  }
}

export default withRouter(NewUser);
