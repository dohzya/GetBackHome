package com.dohzya.gethomeback.models

import com.dohzya.gethomeback.libs._

case class Game(
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


  def apply(worldDim: Dimension, zonesDim: Dimension): Game = {
    val seed = new java.util.Random(System.currentTimeMillis()).nextInt(1000000)
    Game(worldDim, zonesDim, seed)
  }
  def apply(worldDim: Dimension, zonesDim: Dimension, seed: String): Game = {
    val seedInt = seed.foldLeft(0)((t,c) => t+c)
    Game(worldDim, zonesDim, seedInt)
  }
  def apply(
    worldDim: Dimension,
    zonesDim: Dimension,
    seed: Int
  ): Game = {
    val zones = for(x <- 0.to(worldDim.width/zonesDim.width); y <- 0.to(worldDim.height/zonesDim.height))
      yield {
        val infection = SimplexNoise.noise(x, y, 0, seed).abs
        val typeInt = (SimplexNoise.noise(x, y, 1, seed)*100).toInt
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
    Game(worldDim, zones)
  }

  def apply(worldDim: Dimension, zones: Seq[Zone]): Game =
    Game(worldDim, zones, List[Player]())

}
