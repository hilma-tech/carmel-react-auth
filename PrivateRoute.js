
import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import { Redirect } from 'react-router';
import Auth from './Auth';
import b from 'base-64';



class _PrivateRouteAsync extends Component {
  
  state = {haveAccess: false,loaded: false,}

  componentDidMount() {
    this.checkAcces();
  }

  checkAcces = () => {
    
    const { userRole, history } = this.props;
    let { haveAccess } = this.state;    
    Auth.isAuthenticatedSync((isAuth)=>{
        this.setState({haveAccess:isAuth,loaded: true,});
    });

  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { loaded, haveAccess } = this.state;
    if (!loaded) return null;
    console.log("pathname",this.props.location.pathname);

  
    return (
      <Route key={0}
        {...rest}
        render={props => {
          console.log("have access?",haveAccess);
          return haveAccess ? 
          (<Component {...props} />) 
            : 
          (<Redirect to={{pathname: '/',}}/>);
        }}
      />
    );
    
  }
}

const PrivateRouteAsync=withRouter(_PrivateRouteAsync);


class _PrivateRoute extends Component {
  
  constructor(props){
    super(props);
    let kls=Auth.getKls();
    this.klsk=[];
    this.dhp=null;
    console.log("KLS?",kls);
    //console.log("klo?",JSON.parse(b.decode(kls.klo)));
    try{
      let klsk=JSON.parse(b.decode(kls.klo));
      this.klsk=klsk.a;
      this.dhp=klsk.b;

    }catch(err){  }
    this.haveAccess=Auth.isAuthenticated();
  }
  

  render() {
    const { compName,component: Component, ...rest } = this.props;
    if (this.klsk.indexOf(compName)==-1){
      //console.log("compName(%s) is excluded",compName);
      return (<div />);
    }
    //console.log("compName(%s) is included",compName);
    return (<Route key={0} {...rest} render={props => {
          //console.log("Have access?",this.haveAccess);
          return this.haveAccess ? 
          (<Component {...props} />) : (<Redirect to={{pathname: '/login',}}/>);
        }}
      />
    );    
  }
}
const PrivateRoute=withRouter(_PrivateRoute);



class _HomeRoute extends Component {  
  constructor(props){
    super(props);
    let kls=Auth.getKls();
    this.dhp=null;
    try{let klsk=JSON.parse(b.decode(kls.klo));this.dhp=klsk.b;}catch(err){}
    //console.log("this.defaultHomePage?",this.dhp);
    this.haveAccess=Auth.isAuthenticated();
  }
  render() {
    const { comps,component: Component, ...rest } = this.props;
    return (
      <Route exact key={0} {...rest} render={props => {
          let hasDhp=this.dhp!==null && comps[this.dhp];
          let Dhp=<div />;
          if (hasDhp){Dhp=comps[this.dhp];}
          return hasDhp ? (<Dhp {...props} />) : (<Component {...props} />);
        }}
      />
    );

  }
}
const HomeRoute=withRouter(_HomeRoute);

export {PrivateRoute,PrivateRouteAsync,HomeRoute};