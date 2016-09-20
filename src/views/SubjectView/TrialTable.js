import React from 'react';
import { Button } from 'react-bootstrap';
import Icon from 'react-fa';
import { Table, Column, Cell } from 'fixed-data-table';
import Moment from 'moment';
import { Link } from 'react-router';
import classes from './SubjectView.scss';
import { store } from '../../main';

export default class TrialTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    const DateCell = ({rowIndex, data, col, ...props}) => (
      <Cell {...props}>
        {Moment.utc(data[rowIndex][col]).format('MM/DD/YYYY')}
      </Cell>
    );

    const StartTrialButtonCell = ({rowIndex, data, col, ...props}) => (
      <div className={classes.buttonCell}>
        <Button bsStyle='success' bsSize='xsmall' onClick={() => {console.log('clicked')}}>View Details</Button>
      </div>
    );

    const TextCell = ({rowIndex, data, col, ...props}) => (
      <Cell {...props}>
        {data[rowIndex][col] != null ? data[rowIndex][col] : "N/A"}
      </Cell>
    );

    const ConfigLinkCell = ({rowIndex, data, col, ...props}) => (
      <Cell {...props}>
        {(data[rowIndex][col] != null && data[rowIndex][col] != 'N/A') ? <Link to={{pathname: `/collections/${data[rowIndex]['configId']}`}}> {data[rowIndex][col]} </Link> : "N/A"}
      </Cell>
    );

    const TrialResultCell = ({rowIndex, data, col, ...props}) => (
      <Cell {...props}>
        {data[rowIndex][col] != null ? (data[rowIndex][col] ? <Icon className={classes.green} name='check' /> : <Icon className={classes.red} name='times' />) : ""}
      </Cell>
    );
    return (
        <Table
          maxHeight={300}
          rowsCount={this.props.trials ? this.props.trials.length : 0}
          rowHeight={50}
          width={1085}
          height={300}
          headerHeight={50}
        >
        <Column
          header={<Cell>Trial Type</Cell>}
          cell={<TextCell data={this.props.trials} col='trialType' />}
          width={175}
          align='center'
        />
        <Column
          header={<Cell>Configuration Name</Cell>}
          cell={<ConfigLinkCell data={this.props.trials} col='imageConfig' />}
          width={200}
          align='center'
        />
        <Column
          header={<Cell>Attempts Allowed</Cell>}
          cell={<TextCell data={this.props.trials} col='attemptsAllowed' />}
          width={150}
          align='center'
        />
        <Column
          header={<Cell>Attempts Taken</Cell>}
          cell={<TextCell data={this.props.trials} col='attemptsTaken' />}
          width={100}
          align='center'
        />
        <Column
          header={<Cell>Successful Authentication</Cell>}
          cell={<TrialResultCell data={this.props.trials} col='successfulAuth' />}
          width={150}
          align='center'
        />
        <Column
          header={<Cell>Date</Cell>}
          cell={<TextCell data={this.props.trials} col='dateTaken' />}
          width={185}
          align='center'
        />
        <Column
          align='center'
          header={<Cell>Details</Cell>}
          cell={<StartTrialButtonCell data={this.props.trials} />}
          width={125}
        />
      </Table>
    );
  }
}
