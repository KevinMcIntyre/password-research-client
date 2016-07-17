import React from 'react';
import { Button } from 'react-bootstrap';
import Icon from 'react-fa';
import classes from './TestView.scss';

export default class ConfigBox extends React.Component {
  render() {
    return (
      <div className={classes.imageSettingContainer}>
        <div className={classes.imageTestSettings}>
          <div className={classes.imageTestSettingHeader}>
            <h3><span className={classes.optionKey}>Test Configuration:</span> { this.props.configName } </h3>
          </div>
          <div className={classes.imageTestSettingsTableContainer}>
            <table>
              <tbody>
              <tr>
                <td className={classes.optionKey}>
                  Matrix size:
                </td>
                <td>
                  { this.props.rows } x { this.props.columns }
                </td>
              </tr>
              <tr>
                <td className={classes.optionKey}>
                  Number of stages:
                </td>
                <td>
                  { this.props.stages }
                </td>
              </tr>
              <tr>
                <td className={classes.optionKey}>
                  Image May Not Be Present:
                </td>
                <td>
                  { this.props.imageMayNotBePresent ? <span>True</span> : <span>False</span> }
                </td>
              </tr>
              <tr>
                <td className={[classes.stagesKey]}>
                  User Images:
                </td>
                <td>
                  <table className={classes.userImageListing}>
                    <tbody>
                    {this.props.userImages.map(function(userImage, index) {
                      return (
                        <tr key={index}>
                          <td>
                            Stage: {userImage.get('stage')}
                          </td>
                          <td>
                            Row: {userImage.get('row')}
                          </td>
                          <td>
                            Column: {userImage.get('column')}
                          </td>
                          <td>
                            <Button bsSize="xsmall" bsStyle="primary">Set Image</Button>
                          </td>
                          <td>
                            {
                              userImage.get('image') ?
                              <Icon name="check" className={classes.green} /> :
                              <Icon name="times" className={classes.red} />
                            }
                          </td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
