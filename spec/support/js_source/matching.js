// Generated by CoffeeScript 1.3.3
var SEQUENCES, build_dict_matcher, build_ranked_dict, check_date, date_match, date_rx_year_prefix, date_rx_year_suffix, date_sep_match, date_without_sep_match, dictionary_match, digits_match, digits_rx, empty, enumerate_l33t_subs, extend, findall, l33t_match, l33t_table, omnimatch, relevent_l33t_subtable, repeat, repeat_match, sequence_match, spatial_match, spatial_match_helper, translate, year_match, year_rx;

empty = function(obj) {
  var k;
  return ((function() {
    var _results;
    _results = [];
    for (k in obj) {
      _results.push(k);
    }
    return _results;
  })()).length === 0;
};

extend = function(lst, lst2) {
  return lst.push.apply(lst, lst2);
};

translate = function(string, chr_map) {
  var chr;
  return ((function() {
    var _i, _len, _ref, _results;
    _ref = string.split('');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      chr = _ref[_i];
      _results.push(chr_map[chr] || chr);
    }
    return _results;
  })()).join('');
};

omnimatch = function(password) {
  var matcher, matches, _i, _len;
  matches = [];
  for (_i = 0, _len = MATCHERS.length; _i < _len; _i++) {
    matcher = MATCHERS[_i];
    extend(matches, matcher(password));
  }
  return matches.sort(function(match1, match2) {
    return (match1.i - match2.i) || (match1.j - match2.j);
  });
};

dictionary_match = function(password, ranked_dict) {
  var i, j, len, password_lower, rank, result, word, _i, _j;
  result = [];
  len = password.length;
  password_lower = password.toLowerCase();
  for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
    for (j = _j = i; i <= len ? _j < len : _j > len; j = i <= len ? ++_j : --_j) {
      if (password_lower.slice(i, j + 1 || 9e9) in ranked_dict) {
        word = password_lower.slice(i, j + 1 || 9e9);
        rank = ranked_dict[word];
        result.push({
          pattern: 'dictionary',
          i: i,
          j: j,
          token: password.slice(i, j + 1 || 9e9),
          matched_word: word,
          rank: rank
        });
      }
    }
  }
  return result;
};

build_ranked_dict = function(unranked_list) {
  var i, result, word, _i, _len;
  result = {};
  i = 1;
  for (_i = 0, _len = unranked_list.length; _i < _len; _i++) {
    word = unranked_list[_i];
    result[word] = i;
    i += 1;
  }
  return result;
};

build_dict_matcher = function(dict_name, ranked_dict) {
  return function(password) {
    var match, matches, _i, _len;
    matches = dictionary_match(password, ranked_dict);
    for (_i = 0, _len = matches.length; _i < _len; _i++) {
      match = matches[_i];
      match.dictionary_name = dict_name;
    }
    return matches;
  };
};

l33t_table = {
  a: ['4', '@'],
  b: ['8'],
  c: ['(', '{', '[', '<'],
  e: ['3'],
  g: ['6', '9'],
  i: ['1', '!', '|'],
  l: ['1', '|', '7'],
  o: ['0'],
  s: ['$', '5'],
  t: ['+', '7'],
  x: ['%'],
  z: ['2']
};

relevent_l33t_subtable = function(password) {
  var chr, filtered, letter, password_chars, relevent_subs, sub, subs, _i, _len, _ref;
  password_chars = {};
  _ref = password.split('');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    chr = _ref[_i];
    password_chars[chr] = true;
  }
  filtered = {};
  for (letter in l33t_table) {
    subs = l33t_table[letter];
    relevent_subs = (function() {
      var _j, _len1, _results;
      _results = [];
      for (_j = 0, _len1 = subs.length; _j < _len1; _j++) {
        sub = subs[_j];
        if (sub in password_chars) {
          _results.push(sub);
        }
      }
      return _results;
    })();
    if (relevent_subs.length > 0) {
      filtered[letter] = relevent_subs;
    }
  }
  return filtered;
};

enumerate_l33t_subs = function(table) {
  var chr, dedup, helper, k, keys, l33t_chr, sub, sub_dict, sub_dicts, subs, _i, _j, _len, _len1, _ref;
  keys = (function() {
    var _results;
    _results = [];
    for (k in table) {
      _results.push(k);
    }
    return _results;
  })();
  subs = [[]];
  dedup = function(subs) {
    var assoc, deduped, label, members, sub, v, _i, _len;
    deduped = [];
    members = {};
    for (_i = 0, _len = subs.length; _i < _len; _i++) {
      sub = subs[_i];
      assoc = (function() {
        var _j, _len1, _results;
        _results = [];
        for (v = _j = 0, _len1 = sub.length; _j < _len1; v = ++_j) {
          k = sub[v];
          _results.push([k, v]);
        }
        return _results;
      })();
      assoc.sort();
      label = ((function() {
        var _j, _len1, _results;
        _results = [];
        for (v = _j = 0, _len1 = assoc.length; _j < _len1; v = ++_j) {
          k = assoc[v];
          _results.push(k + ',' + v);
        }
        return _results;
      })()).join('-');
      if (!(label in members)) {
        members[label] = true;
        deduped.push(sub);
      }
    }
    return deduped;
  };
  helper = function(keys) {
    var dup_l33t_index, first_key, i, l33t_chr, next_subs, rest_keys, sub, sub_alternative, sub_extension, _i, _j, _k, _len, _len1, _ref, _ref1;
    if (!keys.length) {
      return;
    }
    first_key = keys[0];
    rest_keys = keys.slice(1);
    next_subs = [];
    _ref = table[first_key];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l33t_chr = _ref[_i];
      for (_j = 0, _len1 = subs.length; _j < _len1; _j++) {
        sub = subs[_j];
        dup_l33t_index = -1;
        for (i = _k = 0, _ref1 = sub.length; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
          if (sub[i][0] === l33t_chr) {
            dup_l33t_index = i;
            break;
          }
        }
        if (dup_l33t_index === -1) {
          sub_extension = sub.concat([[l33t_chr, first_key]]);
          next_subs.push(sub_extension);
        } else {
          sub_alternative = sub.slice(0);
          sub_alternative.splice(dup_l33t_index, 1);
          sub_alternative.push([l33t_chr, first_key]);
          next_subs.push(sub);
          next_subs.push(sub_alternative);
        }
      }
    }
    subs = dedup(next_subs);
    return helper(rest_keys);
  };
  helper(keys);
  sub_dicts = [];
  for (_i = 0, _len = subs.length; _i < _len; _i++) {
    sub = subs[_i];
    sub_dict = {};
    for (_j = 0, _len1 = sub.length; _j < _len1; _j++) {
      _ref = sub[_j], l33t_chr = _ref[0], chr = _ref[1];
      sub_dict[l33t_chr] = chr;
    }
    sub_dicts.push(sub_dict);
  }
  return sub_dicts;
};

l33t_match = function(password) {
  var chr, k, match, match_sub, matcher, matches, sub, subbed_chr, subbed_password, token, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
  matches = [];
  _ref = enumerate_l33t_subs(relevent_l33t_subtable(password));
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    sub = _ref[_i];
    if (empty(sub)) {
      break;
    }
    for (_j = 0, _len1 = DICTIONARY_MATCHERS.length; _j < _len1; _j++) {
      matcher = DICTIONARY_MATCHERS[_j];
      subbed_password = translate(password, sub);
      _ref1 = matcher(subbed_password);
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        match = _ref1[_k];
        token = password.slice(match.i, match.j + 1 || 9e9);
        if (token.toLowerCase() === match.matched_word) {
          continue;
        }
        match_sub = {};
        for (subbed_chr in sub) {
          chr = sub[subbed_chr];
          if (token.indexOf(subbed_chr) !== -1) {
            match_sub[subbed_chr] = chr;
          }
        }
        match.l33t = true;
        match.token = token;
        match.sub = match_sub;
        match.sub_display = ((function() {
          var _results;
          _results = [];
          for (k in match_sub) {
            v = match_sub[k];
            _results.push("" + k + " -> " + v);
          }
          return _results;
        })()).join(', ');
        matches.push(match);
      }
    }
  }
  return matches;
};

spatial_match = function(password) {
  var graph, graph_name, matches;
  matches = [];
  for (graph_name in GRAPHS) {
    graph = GRAPHS[graph_name];
    extend(matches, spatial_match_helper(password, graph, graph_name));
  }
  return matches;
};

spatial_match_helper = function(password, graph, graph_name) {
  var adj, adjacents, cur_char, cur_direction, found, found_direction, i, j, last_direction, prev_char, result, shifted_count, turns, _i, _len;
  result = [];
  i = 0;
  while (i < password.length - 1) {
    j = i + 1;
    last_direction = null;
    turns = 0;
    shifted_count = 0;
    while (true) {
      prev_char = password.charAt(j - 1);
      found = false;
      found_direction = -1;
      cur_direction = -1;
      adjacents = graph[prev_char] || [];
      if (j < password.length) {
        cur_char = password.charAt(j);
        for (_i = 0, _len = adjacents.length; _i < _len; _i++) {
          adj = adjacents[_i];
          cur_direction += 1;
          if (adj && adj.indexOf(cur_char) !== -1) {
            found = true;
            found_direction = cur_direction;
            if (adj.indexOf(cur_char) === 1) {
              shifted_count += 1;
            }
            if (last_direction !== found_direction) {
              turns += 1;
              last_direction = found_direction;
            }
            break;
          }
        }
      }
      if (found) {
        j += 1;
      } else {
        if (j - i > 2) {
          result.push({
            pattern: 'spatial',
            i: i,
            j: j - 1,
            token: password.slice(i, j),
            graph: graph_name,
            turns: turns,
            shifted_count: shifted_count
          });
        }
        i = j;
        break;
      }
    }
  }
  return result;
};

repeat_match = function(password) {
  var cur_char, i, j, prev_char, result, _ref;
  result = [];
  i = 0;
  while (i < password.length) {
    j = i + 1;
    while (true) {
      _ref = password.slice(j - 1, j + 1 || 9e9), prev_char = _ref[0], cur_char = _ref[1];
      if (password.charAt(j - 1) === password.charAt(j)) {
        j += 1;
      } else {
        if (j - i > 2) {
          result.push({
            pattern: 'repeat',
            i: i,
            j: j - 1,
            token: password.slice(i, j),
            repeated_char: password.charAt(i)
          });
        }
        break;
      }
    }
    i = j;
  }
  return result;
};

SEQUENCES = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '01234567890'
};

sequence_match = function(password) {
  var chr, cur_char, cur_n, direction, i, i_n, j, j_n, prev_char, prev_n, result, seq, seq_candidate, seq_candidate_name, seq_direction, seq_name, _ref, _ref1, _ref2;
  result = [];
  i = 0;
  while (i < password.length) {
    j = i + 1;
    seq = null;
    seq_name = null;
    seq_direction = null;
    for (seq_candidate_name in SEQUENCES) {
      seq_candidate = SEQUENCES[seq_candidate_name];
      _ref = (function() {
        var _i, _len, _ref, _results;
        _ref = [password.charAt(i), password.charAt(j)];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chr = _ref[_i];
          _results.push(seq_candidate.indexOf(chr));
        }
        return _results;
      })(), i_n = _ref[0], j_n = _ref[1];
      if (i_n > -1 && j_n > -1) {
        direction = j_n - i_n;
        if (direction === 1 || direction === (-1)) {
          seq = seq_candidate;
          seq_name = seq_candidate_name;
          seq_direction = direction;
          break;
        }
      }
    }
    if (seq) {
      while (true) {
        _ref1 = password.slice(j - 1, j + 1 || 9e9), prev_char = _ref1[0], cur_char = _ref1[1];
        _ref2 = (function() {
          var _i, _len, _ref2, _results;
          _ref2 = [prev_char, cur_char];
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            chr = _ref2[_i];
            _results.push(seq_candidate.indexOf(chr));
          }
          return _results;
        })(), prev_n = _ref2[0], cur_n = _ref2[1];
        if (cur_n - prev_n === seq_direction) {
          j += 1;
        } else {
          if (j - i > 2) {
            result.push({
              pattern: 'sequence',
              i: i,
              j: j - 1,
              token: password.slice(i, j),
              sequence_name: seq_name,
              sequence_space: seq.length,
              ascending: seq_direction === 1
            });
          }
          break;
        }
      }
    }
    i = j;
  }
  return result;
};

repeat = function(chr, n) {
  var i;
  return ((function() {
    var _i, _results;
    _results = [];
    for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
      _results.push(chr);
    }
    return _results;
  })()).join('');
};

findall = function(password, rx) {
  var match, matches;
  matches = [];
  while (true) {
    match = password.match(rx);
    if (!match) {
      break;
    }
    match.i = match.index;
    match.j = match.index + match[0].length - 1;
    matches.push(match);
    password = password.replace(match[0], repeat(' ', match[0].length));
  }
  return matches;
};

digits_rx = /\d{3,}/;

digits_match = function(password) {
  var i, j, match, _i, _len, _ref, _ref1, _results;
  _ref = findall(password, digits_rx);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    match = _ref[_i];
    _ref1 = [match.i, match.j], i = _ref1[0], j = _ref1[1];
    _results.push({
      pattern: 'digits',
      i: i,
      j: j,
      token: password.slice(i, j + 1 || 9e9)
    });
  }
  return _results;
};

year_rx = /19\d\d|200\d|201\d/;

year_match = function(password) {
  var i, j, match, _i, _len, _ref, _ref1, _results;
  _ref = findall(password, year_rx);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    match = _ref[_i];
    _ref1 = [match.i, match.j], i = _ref1[0], j = _ref1[1];
    _results.push({
      pattern: 'year',
      i: i,
      j: j,
      token: password.slice(i, j + 1 || 9e9)
    });
  }
  return _results;
};

date_match = function(password) {
  return date_without_sep_match(password).concat(date_sep_match(password));
};

date_without_sep_match = function(password) {
  var candidate, candidates_round_1, candidates_round_2, date_matches, day, digit_match, end, i, j, month, token, valid, year, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
  date_matches = [];
  _ref = findall(password, /\d{4,8}/);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    digit_match = _ref[_i];
    _ref1 = [digit_match.i, digit_match.j], i = _ref1[0], j = _ref1[1];
    token = password.slice(i, j + 1 || 9e9);
    end = token.length;
    candidates_round_1 = [];
    if (token.length <= 6) {
      candidates_round_1.push({
        daymonth: token.slice(2),
        year: token.slice(0, 2),
        i: i,
        j: j
      });
      candidates_round_1.push({
        daymonth: token.slice(0, end - 2),
        year: token.slice(end - 2),
        i: i,
        j: j
      });
    }
    if (token.length >= 6) {
      candidates_round_1.push({
        daymonth: token.slice(4),
        year: token.slice(0, 4),
        i: i,
        j: j
      });
      candidates_round_1.push({
        daymonth: token.slice(0, end - 4),
        year: token.slice(end - 4),
        i: i,
        j: j
      });
    }
    candidates_round_2 = [];
    for (_j = 0, _len1 = candidates_round_1.length; _j < _len1; _j++) {
      candidate = candidates_round_1[_j];
      switch (candidate.daymonth.length) {
        case 2:
          candidates_round_2.push({
            day: candidate.daymonth[0],
            month: candidate.daymonth[1],
            year: candidate.year,
            i: candidate.i,
            j: candidate.j
          });
          break;
        case 3:
          candidates_round_2.push({
            day: candidate.daymonth.slice(0, 2),
            month: candidate.daymonth[2],
            year: candidate.year,
            i: candidate.i,
            j: candidate.j
          });
          candidates_round_2.push({
            day: candidate.daymonth[0],
            month: candidate.daymonth.slice(1, 3),
            year: candidate.year,
            i: candidate.i,
            j: candidate.j
          });
          break;
        case 4:
          candidates_round_2.push({
            day: candidate.daymonth.slice(0, 2),
            month: candidate.daymonth.slice(2, 4),
            year: candidate.year,
            i: candidate.i,
            j: candidate.j
          });
      }
    }
    for (_k = 0, _len2 = candidates_round_2.length; _k < _len2; _k++) {
      candidate = candidates_round_2[_k];
      day = parseInt(candidate.day);
      month = parseInt(candidate.month);
      year = parseInt(candidate.year);
      _ref2 = check_date(day, month, year), valid = _ref2[0], (_ref3 = _ref2[1], day = _ref3[0], month = _ref3[1], year = _ref3[2]);
      if (!valid) {
        continue;
      }
      date_matches.push({
        pattern: 'date',
        i: candidate.i,
        j: candidate.j,
        token: password.slice(i, j + 1 || 9e9),
        separator: '',
        day: day,
        month: month,
        year: year
      });
    }
  }
  return date_matches;
};

date_rx_year_suffix = /(\d{1,2})(\s|-|\/|\\|_|\.)(\d{1,2})\2(19\d{2}|200\d|201\d|\d{2})/;

date_rx_year_prefix = /(19\d{2}|200\d|201\d|\d{2})(\s|-|\/|\\|_|\.)(\d{1,2})\2(\d{1,2})/;

date_sep_match = function(password) {
  var day, k, match, matches, month, valid, year, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
  matches = [];
  _ref = findall(password, date_rx_year_suffix);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    match = _ref[_i];
    _ref1 = (function() {
      var _j, _len1, _ref1, _results;
      _ref1 = [1, 3, 4];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        k = _ref1[_j];
        _results.push(parseInt(match[k]));
      }
      return _results;
    })(), match.day = _ref1[0], match.month = _ref1[1], match.year = _ref1[2];
    match.sep = match[2];
    matches.push(match);
  }
  _ref2 = findall(password, date_rx_year_prefix);
  for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
    match = _ref2[_j];
    _ref3 = (function() {
      var _k, _len2, _ref3, _results;
      _ref3 = [4, 3, 1];
      _results = [];
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        k = _ref3[_k];
        _results.push(parseInt(match[k]));
      }
      return _results;
    })(), match.day = _ref3[0], match.month = _ref3[1], match.year = _ref3[2];
    match.sep = match[2];
    matches.push(match);
  }
  _results = [];
  for (_k = 0, _len2 = matches.length; _k < _len2; _k++) {
    match = matches[_k];
    _ref4 = check_date(match.day, match.month, match.year), valid = _ref4[0], (_ref5 = _ref4[1], day = _ref5[0], month = _ref5[1], year = _ref5[2]);
    if (!valid) {
      continue;
    }
    _results.push({
      pattern: 'date',
      i: match.i,
      j: match.j,
      token: password.slice(match.i, match.j + 1 || 9e9),
      separator: match.sep,
      day: day,
      month: month,
      year: year
    });
  }
  return _results;
};

check_date = function(day, month, year) {
  var _ref;
  if ((12 <= month && month <= 31) && day <= 12) {
    _ref = [month, day], day = _ref[0], month = _ref[1];
  }
  if (day > 31 || month > 12) {
    return [false, []];
  }
  if (!((1900 <= year && year <= 2019))) {
    return [false, []];
  }
  return [true, [day, month, year]];
};
