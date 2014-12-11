const selection = {
  tile: undefined,
  survivors: [],
  mission: undefined,
  order: undefined
};

selection.setTile = (t)=> selection.tile = t;

selection.addSurvivors = (s)=> selection.survivors.push(s);

selection.clearSurvivors = ()=> selection.survivors = [];

export default selection;
