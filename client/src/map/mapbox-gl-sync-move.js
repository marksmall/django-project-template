// This is a fork of the mapbox plugin that avoids a race condition in mapbox-gl-sync-move
// see https://github.com/mapbox/mapbox-gl-sync-move/pull/7

function moveToMapPosition(master, clones) {
  var center = master.getCenter();
  var zoom = master.getZoom();
  var bearing = master.getBearing();
  var pitch = master.getPitch();

  clones.forEach(function(clone) {
    clone.jumpTo({
      center: center,
      zoom: zoom,
      bearing: bearing,
      pitch: pitch
    });
  });
}

// Sync movements of two maps.
//
// All interactions that result in movement end up firing
// a "move" event. The trick here, though, is to
// ensure that movements don't cycle from one map
// to the other and back again, because such a cycle
// - could cause an infinite loop
// - prematurely halts prolonged movements like
//   double-click zooming, box-zooming, and flying
function syncMaps() {
  var maps;
  var argLen = arguments.length;
  if (argLen === 1) {
    maps = arguments[0];
  } else {
    maps = [];
    for (var i = 0; i < argLen; i++) {
      maps.push(arguments[i]);
    }
  }

  // Create all the movement functions, because if they're created every time
  // they wouldn't be the same and couldn't be removed.
  var fns = [];
  maps.forEach(function(map, index) {
    fns[index] = sync.bind(
      null,
      map,
      maps.filter(function(o, i) {
        return i !== index;
      })
    );
  });

  function on() {
    maps.forEach(function(map, index) {
      map.on('move', fns[index]);
    });
  }

  function off() {
    maps.forEach(function(map, index) {
      map.off('move', fns[index]);
    });
  }

  // When one map moves, we turn off the movement listeners
  // on all the maps, move it, then turn the listeners on again
  function sync(master, clones) {
    off();
    moveToMapPosition(master, clones);
    on();
  }

  sync(maps[0], maps.slice(1));
  return function() {
    off();
    fns = [];
    maps = [];
  };
}

export default syncMaps;
