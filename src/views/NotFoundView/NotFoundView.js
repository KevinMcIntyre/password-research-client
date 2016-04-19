import React from 'react';
import { Link } from 'react-router';

export class NotFoundView extends React.Component {
  render() {
    return (
      <div className='container text-center'>
        <h1>The page you were looking for does not exist.</h1>
        <h4>Please use the toolbar to go somewhere else, or click the link below to go back to the home page.</h4>
        <h4>Your browser's back button is also a good option.</h4>
        <hr />
        <Link to='/'>Back To The Home Page </Link>
      </div>
    );
  }
}

export default NotFoundView;
