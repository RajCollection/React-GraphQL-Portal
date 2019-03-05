
import React, { Component, Fragment  } from "react";
import '../App.css';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon,MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBTable, MDBTableBody, MDBTableHead, MDBModal, MDBModalBody, MDBModalHeader, MDBListGroup, MDBListGroupItem} from "mdbreact";
import Notifications, {notify} from 'react-notify-toast';
import { withRouter } from 'react-router-dom';


class Home extends Component {
  constructor(props) {
      super(props);
      this.emailEl = React.createRef();
      this.nameEl = React.createRef();
      this.kycIdEl = React.createRef();
      this.phoneEl = React.createRef();
      this.aadharEl = React.createRef();
      this.passportEl = React.createRef();
      this.addressEl = React.createRef();
      this.updateKycId = React.createRef();
      this.editData = {editKycValue: ''};
      this.updateInput = this.updateInput.bind(this);
      this.updateAadhar = this.updateAadhar.bind(this);
      this.updatePassport = this.updatePassport.bind(this);
      this.updatePhone = this.updatePhone.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.routeChange = this.routeChange.bind(this);
      };

      routeChange(){
        let path = `/`;
        this.props.history.push(path);
        sessionStorage.setItem('tokenKey', '');
      }

      updateInput(event){
        this.setState({inputValue : event.target.value})
      }

      updateAadhar(event){
        this.setState({aadharNumber : event.target.value})
      }

      updatePassport(event){
        this.setState({passportNumber : event.target.value})
      }

      updatePhone(event){
        this.setState({phoneNumber : event.target.value})
      }
        
        
      handleSubmit(){
      console.log('Your input value is: ' + this.state.inputValue)
      }

      kycStatusCheck(data){
        console.log(data)
        if(data === 'Approved'){
          return <p className="verified">Approved</p>;
        }else if(data === 'Verification Failed' || 'null'){
          return <p className="notVerified">Pending</p>
        }
      }

      componentDidMount() {
        window.addEventListener('load', this.handleLoad);
        const requestBody = {
          query: `
                  {
                      allCustomers{
                        _id
                        name
                        email
                        phone
                        kycID
                        kycStatus
                        aadhar
                        passport
                        address
                        aadharStatus
                        passportStatus
                        addressStatus
                      }
                  }
                `
        };

        fetch("http://localhost:5000/api", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
          }
          return res.json();
        }).then(resData => {
          console.log(resData)
          console.log(sessionStorage.getItem('tokenKey'));
          this.setState({
            users: resData.data.allCustomers,
          });
          console.log(this.state.users.length)
        }).catch(err => {
          console.log(err);
          let danger = { background: '#f8d7da', text: "#721c24" };
          notify.show("Something Went Wrong", "custom", 5000,danger);
        });
      }

      updateCustomerData(responseData){
        console.log(this.state.ind_userData)
        console.log(this.state.ind_userData._id)
        console.log(responseData)
        console.log(responseData.aadhar)
        const requestBody = {
          query:`
          mutation{
            updateCustomer(_id:"${this.state.ind_userData._id}",input:{name:"${this.state.ind_userData.name}",email:"${this.state.ind_userData.email}",phone:"${this.state.phoneNumber}",kycID:"${this.state.inputValue}",
          aadhar:"${this.state.aadharNumber}",passport:"${this.state.passportNumber}",address:"${this.state.ind_userData.address}",
          aadharStatus:"${responseData.aadhar}",passportStatus:"${responseData.passport}",addressStatus:"${responseData.phone}",kycStatus:"${responseData.kycStatus}"}){
            _id
            name
            email
            phone
            kycID
            kycStatus
            aadhar
            passport
            address
            aadharStatus
            passportStatus
            addressStatus
          }
          }`
          };

          fetch("http://localhost:5000/api ",{
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
                this.componentDidMount();
                let success = { background: '#d4edda', text: "#721c24" };
                notify.show("E-Wallet Customer details were updated", "custom", 5000,success);
                // document.getElementById("create-customer-form").reset();
              })
              .catch(err => {
              console.log(err);
              let danger = { background: '#f8d7da', text: "#721c24" };
              notify.show("Something Went Wrong", "custom", 5000,danger);
              });
      }

      sendKycRequest= event => {
        if(this.state.inputValue.length === 0){
          let danger = { background: '#f8d7da', text: "#721c24" };
          notify.show("KYC Id should not be empty", "custom", 5000,danger);
        }else{
          console.log('not empty value')
          event.preventDefault();
        console.log(this.kycId,this.requester,this.requestedOn,this.respondedOn,this.kycStatus,this.aadhar,this.passport,this.phone)
        const requestBody = {
          query:`
          mutation{
          createRequest(input:{kycId:"${this.state.inputValue}",requester:"${this.requester}",requestedOn:"${this.requestedOn}",respondedOn:"${this.respondedOn}",
          kycStatus:"${this.kycStatus}",aadhar:"${this.state.aadharNumber}",passport:"${this.state.passportNumber}",
          phone:"${this.state.phoneNumber}"}){
            kycStatus
            aadhar
            phone
            passport
          }
          }`
          };
            fetch("http://localhost:4000/api",{
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
            "Content-Type":"application/json",
            "Authorization": 'Bearer ' + sessionStorage.getItem('tokenKey')
            }
            }
            ).then(res => {
            if (res.status !==200 && res.status !== 201) {
            throw new Error("Failed!");
            }
            return res.json();
            })
            .then(resData => {
              console.log(resData.data)
              this.componentDidMount();
              if(resData.data.createRequest['kycStatus'] === 'Verification Failed'){
                let danger = { background: '#f8d7da', text: "#721c24" };
                notify.show("KYC Status Verification Failed", "custom", 5000,danger);
                this.setState({
                  verifyData: resData.data.createRequest,
                });
              }else{
                let success = { background: '#d4edda', text: "#721c24" };
                notify.show("KYC Status is Approved", "custom", 5000,success);
                  this.setState({
                    verifyData: resData.data.createRequest,
                  }); 
                  this.togglekyc();
              }
              // this. getUser();  
              this.updateCustomerData(this.state.verifyData);   
              
            })
            .catch(err => {
            console.log(err);
            if(err == 'TypeError: Failed to fetch'){
              let danger = { background: '#f8d7da', text: "#721c24" };
              notify.show("Failed to fetch", "custom", 5000,danger);
            }else{
              let danger = { background: '#f8d7da', text: "#721c24" };
              notify.show("KYC Number not found", "custom", 5000,danger);
            }
            });
        }
      
      }

  
      submitHandler = event => {
      event.preventDefault();
      
      const name = this.nameEl.current.value;
      const email = this.emailEl.current.value;
      const kycId = this.kycIdEl.current.value;
      const phone = this.phoneEl.current.value;
      const aadhar = this.aadharEl.current.value;
      const passport = this.passportEl.current.value;
      const address = this.addressEl.current.value;
      const aadharStatus = "null";
      const passportStatus = "null";
      const addressStatus = "null";
      const kycStatus = "null";
      const requestBody = {
          query:`
          mutation{
          createCustomer(input:{name:"${name}",email:"${email}",phone:"${phone}",kycID:"${kycId}",
          aadhar:"${aadhar}",passport:"${passport}",address:"${address}",
          aadharStatus:"${aadharStatus}",passportStatus:"${passportStatus}",addressStatus:"${addressStatus}",kycStatus:"${kycStatus}"}){
            name
            email
            phone
            kycID
            kycStatus
            aadhar
            passport
            address
            aadharStatus
            passportStatus
            addressStatus
          }
          }`
          };

          fetch("http://localhost:5000/api ",{
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
                let success = { background: '#d4edda', text: "#721c24" };
                notify.show("Customer Added successfully", "custom", 5000,success);
                this.toggle();
                this.componentDidMount();
              })
              .catch(err => {
              console.log(err);
              let danger = { background: '#f8d7da', text: "#721c24" };
              notify.show("Something Went Wrong", "custom", 5000,danger);
              });
      }

      state = {
        collapseID: "",
        modal: false,
        verifyList:false,
        users: [],
        verifyData:{},
        ind_user:[],
        inputValue: '',
        updatedKycValue:'',
        ind_userData:{},
        kycStatusData:"",
        aadharStatusData:"",
        passportStatusData:"",
        phoneStatusData:"",
        aadharNumber:"",
        passportNumber:"",
        phoneNumber:""
      };

      toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
        collapseID: prevState.collapseID !== collapseID ? collapseID : ""
      }));

      toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
      }

      getUser = (data) => { 
        console.log(data)
        console.log(sessionStorage.getItem('tokenKey'));
        this.setState({verifyData : ''})
        this.setState({
          ind_userData: data,
        });
        this.state.kycStatusData = data.kycStatus;
        this.state.aadharStatusData= data.aadharStatus;
        this.state.passportStatusData= data.passportStatus;
        this.state.phoneStatusData= data.addressStatus;
        this.state.aadharNumber= data.aadhar;
        this.state.passportNumber= data.passport;
        this.state.phoneNumber= data.phone;
        console.log(this.state.kycStatusData)
        console.log(this.state.aadharStatusData)
        console.log(this.state.passportStatusData)
        console.log(this.state.phoneStatusData)
        this.setState({
          inputValue: data['kycID']
          }); 
          this.state.verifyList = false;

        console.log(data['_id'])
        this.kycId = data['_id'];
        this.requester = "E-Wallet";
        this.requestedOn = "2019-02-20 10:26:45";
        this.respondedOn = "null";
        this.kycStatus = "null";
        this.aadhar = data['aadhar'];
        this.passport = data['passport'];
        this.phone =data['phone'];

      }

      togglekyc = () => {
        this.setState({
          kycModal: !this.state.kycModal
        });
      }

      toggleVerifyList = () => {
        this.setState({
          verifyList: !this.state.verifyList
        });
      }

render() {
  const isLoggedIn = "True";
  const { users } = this.state;
  const { verifyData } = this.state;
  const { ind_user } = this.state;
  return (
      <div className="homeWrapper">
      <Notifications options={{zIndex: 2000, top: '35px'}}/> 
      <MDBNavbar className="navbarTop" dark expassportd="md">
        <MDBNavbarBrand>
          <strong className="white-text">E-Wallet</strong>
          <MDBIcon className="logOut pointer" onClick={this.routeChange} icon="sign-out-alt" />
        </MDBNavbarBrand>
        {/* <MDBNavbarToggler onClick={this.toggleCollapse("navbarCollapse3")} /> */}
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink className="waves-effect waves-light" to="#!">
                <MDBIcon icon="cog" className="mr-1" />Settings</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user" className="mr-1" />Profile
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default" right>
                  <MDBDropdownItem href="#!">My account</MDBDropdownItem>
                  <MDBDropdownItem href="#!">Log out</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>

    <div className="home-wrapper">

      <MDBRow className="mainContent">
        <MDBCol size="12" className="listCard">
            <MDBCard id="style-5" className="cardStyle customerListCard scrollbar">

                <MDBCardBody className="">
                <h5 className="primaryColor">E-Wallet Customers</h5>
                <div className={ "flexcenter noData" + " "+ (this.state.users.length === 0 ? 'show' : 'hide')}>No Customers to display</div>
                <div className={ (this.state.users.length === 0 ? 'hide' : 'show')}>
                <MDBTable striped>
                    <MDBTableHead>
                        <tr className="inputText">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Aadhar</th>
                        <th>Passport</th>
                        <th>KYC Status</th>
                        </tr>
                    </MDBTableHead>
                      <MDBTableBody>
                        {users.map(user => (
                          <tr className="pointer" onClick={() =>{this.getUser(user); this.togglekyc();} }  key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.aadhar}</td>
                            <td>{user.passport}</td>
                            {/* <td className={ (user.kycStatus === "Approved" ? 'verified' : 'notVerified')}>{user.kycStatus === "null" ? 'Pending' : 'Approved'}</td> */}
                            <td>{this.kycStatusCheck(user.kycStatus)}</td>
                          </tr>
                        ))}
                      </MDBTableBody>
                    </MDBTable>
                    </div>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
        <Fragment>
          <MDBBtn onClick={this.toggle} className="addButton flexcenter" tag="a" size="lg" floating gradient="red">
            <MDBIcon icon="plus" size="lg"/>
          </MDBBtn>
      </Fragment>

      {/* add customer modal */}
      <MDBModal isOpen={this.state.modal} toggle={this.toggle} size="lg">
        <MDBModalHeader className="primaryColor modalHeader" toggle={this.toggle}>Add E-Wallet Customer</MDBModalHeader>
        <MDBModalBody>
        <form onSubmit={this.submitHandler}>
        <div className="inputRow">
          <div className="singleInput">
            <div className="form-group">
                <label htmlFor="cusName" className="inputText">Name</label>
                <input type="text" className="customerFormData" id="cusName" ref={this.nameEl}/>
            </div>
          </div>
          <div className="singleInput">
            <div className="form-group">
              <label htmlFor="cusEmail" className="inputText">Email</label>
              <input type="text" className="customerFormData" id="cusEmail" ref={this.emailEl}/>
            </div>
          </div>
        </div>

        <div className="inputRow">
          <div className="singleInput">
            <div className="form-group">
              <label htmlFor="cusPhone" className="inputText">Phone</label>
              <input type="text" className="customerFormData" id="cusPhone" ref={this.phoneEl}/>
            </div>
          </div>
          <div className="singleInput">
            <div className="form-group">
              <label htmlFor="cusKyc" className="inputText">KYC Id</label>
              <input type="text" className="customerFormData" id="cusKyc" ref={this.kycIdEl}/>
            </div>
          </div>
        </div>
        <div className="inputRow">
          <div className="singleInput">
            <div className="form-group">
              <label htmlFor="cusPhone" className="inputText">Aadhar Number</label>
              <input type="text" className="customerFormData" id="cusAadhar" ref={this.aadharEl}/>
            </div>
          </div>
          <div className="singleInput">
            <div className="form-group">
              <label htmlFor="cusKyc" className="inputText">passport Number</label>
              <input type="text" className="customerFormData" id="cuspassport" ref={this.passportEl}/>
            </div>
          </div>
          <div className="form-group">
              <label htmlFor="cusKyc" className="inputText">Address</label>
              <textarea id="style-5" rows="5" type="text" className="customerFormData textArea" id="cusAddress" ref={this.addressEl}/>
          </div>
        </div>
      
          <div className="addBtn flexcenter">
          <Fragment>
              <MDBBtn type="submit" color="light-green">Add</MDBBtn>
          </Fragment>
          </div>
        </form>
        </MDBModalBody>

      </MDBModal>

      {/* kyc modal */}
      <MDBModal isOpen={this.state.kycModal} toggle={this.togglekyc} size="lg">
        <MDBModalHeader className="primaryColor modalHeader" toggle={this.togglekyc}>KYC Status</MDBModalHeader>
        <MDBModalBody>
           <div className="form-group">
              <label htmlFor="cusKyc" className="inputText">KYC Id</label>
              <input type="text" onChange={this.updateInput} defaultValue={this.state.inputValue === "null" ? '' : this.state.inputValue}  className="customerFormData"/>

            </div>
            <MDBListGroup  style={{ width: "100%" }}>
            {/* <MDBListGroup className={ (this.state.kycStatusData === "Approved" ? 'hide' : 'show')}  style={{ width: "100%" }}> */}
            <div className={ (this.state.kycStatusData === "Approved" ? 'hide' : 'show')} >
              <MDBListGroupItem className="listBorder">
              <MDBRow>
                <MDBCol size="1"><MDBIcon className="iconSize" far icon="address-card" /></MDBCol>
                <MDBCol size="3">Aadhar</MDBCol>
                <MDBCol size="4">
                <input type="text" onChange={this.updateAadhar} defaultValue={this.state.aadharNumber}  className="customerFormData kycDetailsData"/>
                </MDBCol>
                {/* <MDBCol size="1"><MDBIcon className="verified" icon="check" /></MDBCol> */}
                <MDBCol size="4" className={ (this.state.verifyData.aadhar === "Details Not Matched" ? 'notVerified' : 'verified')}>{this.state.verifyData.aadhar}</MDBCol>
              </MDBRow>
              </MDBListGroupItem>
            </div>
            <div className={ (this.state.kycStatusData === "Approved" ? 'show' : 'hide')}>
              <MDBListGroupItem className="listBorder">
              <MDBRow>
                <MDBCol size="1"><MDBIcon className="iconSize" far icon="address-card" /></MDBCol>
                <MDBCol size="3">Aadhar</MDBCol>
                <MDBCol size="4">{this.state.aadharNumber}</MDBCol>
                {/* <MDBCol size="1"><MDBIcon className="verified" icon="check" /></MDBCol> */}
                <MDBCol size="4" className={ (this.state.aadharStatusData === "Details Not Matched" ? 'notVerified' : 'verified')}>{this.state.aadharStatusData}</MDBCol>
              </MDBRow>
              </MDBListGroupItem>
            </div>
              <div className={ (this.state.kycStatusData === "Approved" ? 'hide' : 'show')} >
              <MDBListGroupItem className="listBorder">
              <MDBRow>
                  <MDBCol size="1"><MDBIcon className="iconSize" icon="passport" /></MDBCol>
                  <MDBCol size="3">Passport</MDBCol>
                  <MDBCol size="4">
                  <input type="text" onChange={this.updatePassport} defaultValue={this.state.passportNumber}  className="customerFormData kycDetailsData"/>
                  </MDBCol>
                <MDBCol size="4" className={ (this.state.verifyData.passport === "Details Not Matched" ? 'notVerified' : 'verified')}>{this.state.verifyData.passport}</MDBCol>
              </MDBRow>
              </MDBListGroupItem>
              </div>
              <div className={ (this.state.kycStatusData === "Approved" ? 'show' : 'hide')}>
              <MDBListGroupItem className="listBorder">
              <MDBRow>
                  <MDBCol size="1"><MDBIcon className="iconSize" icon="passport" /></MDBCol>
                  <MDBCol size="3">Passport</MDBCol>
                  <MDBCol size="4">{this.state.passportNumber}</MDBCol>
                <MDBCol size="4" className={ (this.state.passportStatusData === "Details Not Matched" ? 'notVerified' : 'verified')}>{this.state.passportStatusData}</MDBCol>
              </MDBRow>
              </MDBListGroupItem>
              </div>
              <div className={ (this.state.kycStatusData === "Approved" ? 'hide' : 'show')} >
              <MDBListGroupItem  className="listBorder">
              <MDBRow>
                <MDBCol size="1"><MDBIcon className="iconSize" icon="phone" /></MDBCol>
                <MDBCol size="3">Contact</MDBCol>
                <MDBCol size="4">
                <input type="text" onChange={this.updatePhone} defaultValue={this.state.phoneNumber}  className="customerFormData kycDetailsData"/>
                </MDBCol>
                <MDBCol size="4" className={ (this.state.verifyData.phone === "Details Not Matched" ? 'notVerified' : 'verified')}>{this.state.verifyData.phone}</MDBCol>
              </MDBRow>
              </MDBListGroupItem>
              </div>
              <div className={ (this.state.kycStatusData === "Approved" ? 'show' : 'hide')}>
              <MDBListGroupItem>
              <MDBRow> 
                <MDBCol size="1"><MDBIcon className="iconSize" icon="phone" /></MDBCol>
                <MDBCol size="3">Contact</MDBCol>
                <MDBCol size="4">{this.state.phoneNumber}</MDBCol>
                <MDBCol size="4" className={ (this.state.phoneStatusData === "Details Not Matched" ? 'notVerified' : 'verified')}>{this.state.phoneStatusData}</MDBCol>
              </MDBRow>
              </MDBListGroupItem>
              </div>
          </MDBListGroup>

          <br/>

            <div className="addBtn flexcenter">
            <Fragment>
                <label className={"verifiedLabel" + " " +  (this.state.kycStatusData === "Approved" ? 'show' : 'hide')}>KYC Status is Approved</label>
                <MDBBtn className={ (this.state.kycStatusData === "Approved" ? 'hide' : 'show')}  type="button" onClick={this.sendKycRequest} color="light-green">Check</MDBBtn>
            </Fragment>
          </div>
   
        </MDBModalBody>

      </MDBModal>
      </MDBRow>

    </div>

      </div>
    );
  }
}

export default Home;