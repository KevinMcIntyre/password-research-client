import React from 'react';
import { Button } from 'react-bootstrap';
import Icon from 'react-fa';
import { Table, Column, Cell } from 'fixed-data-table';
import Moment from 'moment';
import { startTrial } from '../../redux/modules/trials';
import classes from './TestView.scss';
import { store } from '../../main';

export default class TrialTable extends React.Component {
  constructor() {
    super();
    this.startTrial = this.startTrial.bind(this);
  }

  startTrial(trialId) {
    store.dispatch(startTrial(trialId));
  }

  render() {
    const DateCell = ({rowIndex, data, col, ...props}) => (
      <Cell {...props}>
        {Moment.utc(data[rowIndex][col]).format('MM/DD/YYYY')}
      </Cell>
    );

    const StartTrialButtonCell = ({rowIndex, data, col, ...props}) => (
      <div className={classes.runTestButtonCell}>
        <Button bsStyle='success' bsSize='xsmall' onClick={this.startTrial.bind(undefined, data[rowIndex]['id'])}>Start Trial</Button>
      </div>
    );

    const TextCell = ({rowIndex, data, col, ...props}) => (
      <Cell {...props}>
        {data[rowIndex][col] != null ? data[rowIndex][col] : "N/A"}
      </Cell>
    );
    return (
        <Table
          maxHeight={300}
          rowsCount={this.props.trials ? this.props.trials.length : 0}
          rowHeight={50}
          width={1000}
          height={300}
          headerHeight={50}
        >
        <Column
          header={<Cell>Participant Name</Cell>}
          cell={<TextCell data={this.props.trials} col='subjectName' />}
          width={275}
          align='center'
        />
        <Column
          header={<Cell>Test Type</Cell>}
          cell={<TextCell data={this.props.trials} col='trialType' />}
          width={150}
          align='center'
        />
        <Column
          header={<Cell>Image Config Name</Cell>}
          cell={<TextCell data={this.props.trials} col='configName' />}
          width={240}
          align='center'
        />
        <Column
          header={<Cell>Date Created</Cell>}
          cell={<TextCell data={this.props.trials} col='creationDate' />}
          width={185}
          align='center'
          />
        <Column

          align='center'
          header={<Cell>Run Test</Cell>}
          cell={<StartTrialButtonCell data={this.props.trials} />}
          width={150}
        />
      </Table>
    );
  }
}
