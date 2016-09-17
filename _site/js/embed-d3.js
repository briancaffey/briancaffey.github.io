(function() {
  window.onload = function() {
    var dataset;
    dataset = [5, 10, 15, 20, 25];
    return d3.select("#example").selectAll("p").data(dataset).enter().append("p").text(function(d) {
      return d;
    });
  };

}).call(this);