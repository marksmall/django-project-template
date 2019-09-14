import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Admin from './admin.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
