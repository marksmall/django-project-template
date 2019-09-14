import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { activateAccount } from './accounts.actions';

import AccountActivation from './account-activation-form.component';

const mapStateToProps = (state, props) => ({ props });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      activateAccount
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountActivation);
