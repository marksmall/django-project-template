import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { isAcquisitionMode } from '../acquisitions/acquisitions.selector';

// import {
//   actualSourceId,
//   operationalSourceId,
//   nonOperationalSourceId,
//   operationalPointsSourceId
// } from './map.constants';

// import {
//   isLoading,
//   getMapStyle,
//   getStormsList,
//   getSelectedOperationalPoint,
//   getCurrentStormName
// } from './map.selector';

// import {
//   fetchStorms,
//   onStormSelection,
//   selectOperationalStormTrack,
//   selectOperationalStormPoint,
//   hoveredOverOperationalStormTrack
// } from './map.actions';

// import {
//   toggleAcquisitionMode,
//   addAcquisition,
//   highlightAcquisition
// } from '../acquisitions/acquisitions.actions';

import Map from './map.component';

const mapStateToProps = state => {
  return {
    // loading: isLoading(state),
    // mapStyle: getMapStyle(state),
    // storms: getStormsList(state),
    // actualSourceId,
    // operationalSourceId,
    // nonOperationalSourceId,
    // operationalPointsSourceId,
    // acquisitionMode: isAcquisitionMode(state),
    // selectedOperationalPoint: getSelectedOperationalPoint(state),
    // currentStormName: getCurrentStormName(state)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // fetchStorms,
      // onStormSelection,
      // selectOperationalStormTrack,
      // selectOperationalStormPoint,
      // hoveredOverOperationalStormTrack,
      // toggleAcquisitionMode,
      // addAcquisition,
      // highlightAcquisition
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
