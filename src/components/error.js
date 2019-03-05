import React, { Component} from 'react';
class Error extends Component {

  render() {
 
    return (
  <div className="login-wrapper">
 
  </div>
    );
  }
}

export default Error;

// class Login extends React.Component {
//     constructor(props) {
//     super(props);
    
//     this.state = {
//     username: "",
//     password: "",
//     error: false
//     };
    
//     this.handleChange = this.handleChange.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//     }
    
//     onSubmit(e) {
    
//     e.preventDefault();
    
//     const { username, password } = this.state;
//     const { history } = this.props;
    
//     this.setState({ error: false });
    
//     if (!(username === "admin" && password === "admin")) {
//     return this.setState({ error: true });
//     }
    
//     console.log("you're logged in. yay!");
//     store.set("loggedIn", true);
//     history.push("/Home");
//     }
    
//     handleChange(e, { name, value }) {
//     this.setState({ [name]: value });
//     }
    
//     render() {
//     const { error } = this.state;
    
//     return (
//     <Grid>
//     <Helmet>
//     <title>Login</title>
//     </Helmet>
    
//     <Grid.Column width={6} />
//     <Grid.Column width={4}>
//     <Form
//     className={styles.loginForm}
//     error={error}
//     onSubmit={this.onSubmit}
//     >
//     <Header as="h1">Login</Header>
//     {error && (
//     <Message
//     error={error}
//     content="That username/password is incorrect. Try again!"
//     />
//     )}
//     <Form.Input
//     inline
//     label="Username"
//     name="username"
//     onChange={this.handleChange}
//     />
//     <Form.Input
//     inline
//     label="Password"
//     type="password"
//     name="password"
//     onChange={this.handleChange}
//     />
//     <Form.Button type="submit">Go!</Form.Button>
//     </Form>
//     </Grid.Column>
//     </Grid>
//     );
//     }
//     }