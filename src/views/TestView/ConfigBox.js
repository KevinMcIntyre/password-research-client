import React from 'react';
import classes from './TestView.scss';

export default class ConfigBox extends React.Component {

  render() {
    return (
      <div className={classes.imageSettingContainer}>
        <div className={classes.imageTestSettings}>
          <div className={classes.imageTestSettingHeader}>
            <h3><span className={classes.optionKey}>Option Set:</span> Default</h3>
          </div>
          <div className={classes.imageTestSettingsTableContainer}>
            <table>
              <tbody>
              <tr>
                <td className={classes.optionKey}>
                  Matrix size:
                </td>
                <td>
                  4 x 4
                </td>
              </tr>
              <tr>
                <td className={classes.optionKey}>
                  Number of stages:
                </td>
                <td>
                  6
                </td>
              </tr>
              <tr>
                <td className={classes.optionKey}>
                  Image May Not Be Present:
                </td>
                <td>
                  True
                </td>
              </tr>
              <tr>
                <td className={[classes.stagesKey]}>
                  Stages:
                </td>
                <td>
                  <table>
                    <tbody>
                    <tr>
                      <td>
                        Stage 1:
                      </td>
                      <td>
                        Random
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Stage 2:
                      </td>
                      <td>
                        Random
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Stage 3:
                      </td>
                      <td>
                        Custom stage
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Stage 4:
                      </td>
                      <td>
                        Collection - 'Flowers'
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Stage 5:
                      </td>
                      <td>
                        Custom stage
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Stage 6:
                      </td>
                      <td>
                        Random
                      </td>
                    </tr>
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
