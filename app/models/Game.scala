package com.dohzya.gethomeback.models

import com.dohzya.gethomeback.libs.Generator

case class Game(
  name: String,
  dim: Dimension,
  zones: Seq[Zone],
  players: Seq[Player]
) {

  def player(name: String): Player = {
    players find {_.name == name} match {
      case Some(p) => p
      case None => Player(name)
    }
  }

}
object Game {

  def apply(
    name: String,
    worldDim: Dimension,
    zonesDim: Dimension
  ): Game = {
    val gen = Generator(name)(_)
    val infectionGen = gen(0)
    val typeGen = gen(1)
    val zones = for(x <- 0.to(worldDim.width/zonesDim.width); y <- 0.to(worldDim.height/zonesDim.height))
      yield {
        val infection = infectionGen(x, y).abs
        val typeInt = (typeGen(x, y) * 100).toInt
        Zone(
          Position(x*zonesDim.width, y*zonesDim.height),
          Dimension(zonesDim.width, zonesDim.height),
          ts = 0,
          infos = Zone.Infos(
            zoneType = if (typeInt < 20) "plaine"
                       else if (typeInt < 40) "city"
                       else if (typeInt < 60) "field"
                       else if (typeInt < 80) "water"
                       else if (typeInt < 100) "boue"
                       else "",
            infection = infection
          )
        )
      }
    Game(name, worldDim, zones)
  }

  def apply(name: String, worldDim: Dimension, zones: Seq[Zone]): Game =
    Game(name, worldDim, zones, List[Player]())

}
