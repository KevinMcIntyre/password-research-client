import React from 'react';
import { connect } from 'react-redux';
import { actions as viewActions} from '../../redux/modules/trials';

const mapStateToProps = (state) => ({
  viewState: state.trials
});

export class TrialView extends React.Component {
    componentWillUnmount() {
        this.props.endTrial();
    }
    render() {
        return (
            <div className='container text-center'>
            <h1>Off with their heads!</h1>
            </div>
        );
    }
}

export default connect(mapStateToProps, viewActions)(TrialView);