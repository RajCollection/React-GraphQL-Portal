import React, { Component, Fragment } from 'react';
import logo from '../img/logo.png';
import '../App.css';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage,  MDBRow, MDBCol} from 'mdbreact';
import Notifications, {notify} from 'react-notify-toast';
class Login extends Component {
    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        }
        
        
        submitHandler = event => {
        const { history } = this.props;
        event.preventDefault();
        
        const password = this.passwordEl.current.value;
        const email = this.emailEl.current.value; 
        console.log(email, password);
        if(email === 'admin' && password === 'admin'){
          let success = { background: '#d4edda', text: "#721c24" };
          notify.show("Login Success", "custom", 5000,success);
          const requestBody = {
            query:`{
              getToken
            }`
            };

            fetch("http://localhost:4000/api",{
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                "Content-Type":"application/json"
                }
                }
                ).then(res => {
                if (res.status !==200 && res.status !== 201) {
                throw new Error("Failed!");
                }
                return res.json();
                })
                .then(resData => {
                console.log(resData);
                console.log(resData.data.getToken);
                sessionStorage.setItem('tokenKey', resData.data.getToken);
                })
                .catch(err => {
                console.log(err);
                });
          history.push("/Home");
        }else{
            console.log('error')
            let danger = { background: '#f8d7da', text: "#721c24"};
            notify.show("Please check Login details", "custom", 5000,danger);
        }

    }

  render() {

    return (
  <div className="login-wrapper">
     <Notifications options={{zIndex: 2000, top: '35px'}}/> 
  <div className="logoDiv flexcenter">
    <MDBRow>
      <MDBCol>
      <MDBCardImage className="img-fluid logo" src={logo} waves />
      </MDBCol>
    </MDBRow>
  </div>
  <div className="cardDiv">
    <MDBCol className="flexcenter cardCol">
      <MDBCard className="cardStyle">
        <MDBCardBody className="loginCard">
          <MDBRow className="">
              <MDBCol>
               <h5 className="headerText">Login</h5>
              </MDBCol>
            </MDBRow>
                {/* <MDBInput  className="loginInput" label="Email" /> */}
                <form onSubmit={this.submitHandler}>
                <div className="form-group">
                    <label htmlFor="userEmail" className="loginText">Email</label>
                    <input type="text" className="customerFormData" id="userEmail" ref={this.emailEl}/>
                </div>
                {/* <MDBInput  className="loginInput" type="password" label="Password" /> */}
                <div className="form-group">
                    <label htmlFor="userPassword" className="loginText">Password</label>
                    <input type="password" className="customerFormData" id="userPassword" ref={this.passwordEl}/>
                </div>
              <Fragment>
                <MDBBtn type="submit" color="light-green">Login</MDBBtn>
              </Fragment>
              </form>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
    </div>
  </div>
    );
  }
}

export default Login;
