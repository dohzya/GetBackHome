export default {
  hexjs: {
    clean: true,
    heuristic: function (place1, place2) {
      return place1.distanceTo(place2);
    }
  }
}
