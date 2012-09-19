// Generated by CoffeeScript 1.3.3
var DICTIONARY_MATCHERS, GRAPHS, KEYBOARD_AVERAGE_DEGREE, KEYBOARD_STARTING_POSITIONS, KEYPAD_AVERAGE_DEGREE, KEYPAD_STARTING_POSITIONS, MATCHERS, calc_average_degree, k, ranked_user_inputs_dict, time, v, zxcvbn;

ranked_user_inputs_dict = {};

DICTIONARY_MATCHERS = [build_dict_matcher('passwords', build_ranked_dict(passwords)), build_dict_matcher('english', build_ranked_dict(english)), build_dict_matcher('male_names', build_ranked_dict(male_names)), build_dict_matcher('female_names', build_ranked_dict(female_names)), build_dict_matcher('surnames', build_ranked_dict(surnames)), build_dict_matcher('user_inputs', ranked_user_inputs_dict)];

MATCHERS = DICTIONARY_MATCHERS.concat([l33t_match, digits_match, year_match, date_match, repeat_match, sequence_match, spatial_match]);

GRAPHS = {
  'qwerty': qwerty,
  'dvorak': dvorak,
  'keypad': keypad,
  'mac_keypad': mac_keypad
};

calc_average_degree = function(graph) {
  var average, k, key, n, neighbors, v;
  average = 0;
  for (key in graph) {
    neighbors = graph[key];
    average += ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = neighbors.length; _i < _len; _i++) {
        n = neighbors[_i];
        if (n) {
          _results.push(n);
        }
      }
      return _results;
    })()).length;
  }
  average /= ((function() {
    var _results;
    _results = [];
    for (k in graph) {
      v = graph[k];
      _results.push(k);
    }
    return _results;
  })()).length;
  return average;
};

KEYBOARD_AVERAGE_DEGREE = calc_average_degree(qwerty);

KEYPAD_AVERAGE_DEGREE = calc_average_degree(keypad);

KEYBOARD_STARTING_POSITIONS = ((function() {
  var _results;
  _results = [];
  for (k in qwerty) {
    v = qwerty[k];
    _results.push(k);
  }
  return _results;
})()).length;

KEYPAD_STARTING_POSITIONS = ((function() {
  var _results;
  _results = [];
  for (k in keypad) {
    v = keypad[k];
    _results.push(k);
  }
  return _results;
})()).length;

time = function() {
  return (new Date()).getTime();
};

zxcvbn = function(password, user_inputs) {
  var i, matches, result, start, _i, _ref;
  start = time();
  if (user_inputs != null) {
    for (i = _i = 0, _ref = user_inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      ranked_user_inputs_dict[user_inputs[i]] = i + 1;
    }
  }
  matches = omnimatch(password);
  result = minimum_entropy_match_sequence(password, matches);
  result.calc_time = time() - start;
  return result;
};

if (typeof window !== "undefined" && window !== null) {
  window.zxcvbn = zxcvbn;
  if (typeof window.zxcvbn_load_hook === "function") {
    window.zxcvbn_load_hook();
  }
} else if (typeof exports !== "undefined" && exports !== null) {
  exports.zxcvbn = zxcvbn;
}
