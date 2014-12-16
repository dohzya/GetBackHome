const selection = {
  tile: undefined,
  path: [],
  survivors: [],
  mission: undefined,
  order: undefined
};

selection.setTile = (t)=> selection.tile = t;

selection.setPath = (p)=> selection.path = p;

selection.addSurvivors = (s)=> selection.survivors.push(s);

selection.clearSurvivors = ()=> selection.survivors = [];

export default selection;
