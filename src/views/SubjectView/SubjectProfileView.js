import React from 'react';
import { store } from '../../main';
import { actions as appActions } from '../../redux/modules/app';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { actions as viewActions } from '../../redux/modules/subjects';
import { actions as imageActions } from '../../redux/modules/images';
import moment from 'moment';
import classes from './SubjectView.scss';
import PasswordModal from './ProfileManagementModals/PasswordModal.js';
import PinModal from './ProfileManagementModals/PinModal.js';
import PassImageModal from './ProfileManagementModals/PassImageModal.js';

const mapStateToProps = (state) => ({
  viewState: state.subjects
});

export class SubjectProfileView extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    store.dispatch(appActions.setLoadingState(true, 'Loading profile'));
  }

  componentDidMount() {
    let { subjectId } = this.props.params;
    this.props.loadProfile(subjectId);
    store.dispatch(imageActions.loadImages(parseInt(subjectId, 10), 0));
  }

  componentWillUnmount() {
    store.dispatch(imageActions.clearSubject());
  }

  shouldComponentUpdate(nextProps) {
    return this.props.viewState._root.nodes.map(node => {
      if (nextProps.viewState.get(node[0]) !== node[1]) {
        return true;
      }
    });
  }

  render() {
    return (
      <div className='container text-center'>
        <h1>Subject Profile</h1>

        <div className={classes.imageSettingContainer}>
          <div className={classes.imageTestSettings}>
            <div className={classes.imageTestSettingsTableContainer}>
              <table>
                <tbody>
                <tr>
                  <th>
                    Basic Information
                  </th>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    ID:
                  </td>
                  <td>
                    {this.props.params.subjectId}
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Name:
                  </td>
                  <td>
                    {this.props.viewState.get('firstName')} {this.props.viewState.get('lastName')}
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Email:
                  </td>
                  <td>
                    {this.props.viewState.get('email')}
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Birthday:
                  </td>
                  <td>
                    {moment(this.props.viewState.get('birthday')).utc().format('MMMM DD, YYYY')}
                  </td>
                </tr>
                <tr>
                  <th>
                    Authorization Credentials
                  </th>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Password:
                  </td>
                  <td className={classes.buttonTableData}>
                    <Button bsSize='small' bsStyle='primary' onClick={this.props.togglePasswordModal}>Manage
                      Password</Button>
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Pin Number:
                  </td>
                  <td className={classes.buttonTableData}>
                    <Button bsSize='small' bsStyle='primary' onClick={this.props.togglePinModal}>Manage Pin
                      Number</Button>
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Pass-Images:
                  </td>
                  <td className={classes.buttonTableData}>
                    <Button bsSize='small' bsStyle='primary' onClick={this.props.togglePassImageModal}>Manage
                      Pass-Images</Button>
                  </td>
                </tr>
                <tr>
                  <th>
                    Trial Results
                  </th>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <PasswordModal
            show={this.props.viewState.get('showPasswordModal')}
            subjectId={this.props.params.subjectId}
            subjectName={this.props.viewState.get('firstName') + ' ' + this.props.viewState.get('lastName')}
            password={this.props.viewState.get('password')}
            entropy={this.props.viewState.get('passwordEntropy')}
            strength={this.props.viewState.get('passwordStrength')}
            savePassword={this.props.savePassword}
            toggleModal={this.props.togglePasswordModal}
            />
          <PinModal
            show={this.props.viewState.get('showPinModal')}
            subjectId={this.props.params.subjectId}
            subjectName={this.props.viewState.get('firstName') + ' ' + this.props.viewState.get('lastName')}
            pinNumber={this.props.viewState.get('pinNumber')}
            savePinNumber={this.props.savePinNumber}
            toggleModal={this.props.togglePinModal}
            />
          <PassImageModal
            show={this.props.viewState.get('showPassImageModal')}
            subjectId={this.props.params.subjectId}
            subjectName={this.props.viewState.get('firstName') + ' ' + this.props.viewState.get('lastName')}
            collections={this.props.viewState.get('userCollections')}
            toggleModal={this.props.togglePassImageModal}
            />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(SubjectProfileView);
