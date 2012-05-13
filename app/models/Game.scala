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
    val type1Gen = gen(1)
    val type2Gen = gen(2)
    val zones = for(xx <- 0.to(worldDim.width/zonesDim.width * 2); yy <- 0.to(worldDim.height/zonesDim.height * 2))
      yield {
        val x = xx - 10; val y = yy - 10
        val infection = infectionGen(x, y).abs
        val height = (type1Gen(x, y) * 700 + 200).toInt
        val (type1, type2) = {
          val type2Int = (type2Gen(x, y) * 1000).toInt
          if (height < 12) {
            val t2 = if (type2Int > 900) Some("city")
                     else None
            ("water", t2)
          }
          else if (height < 7) {
            val t2 = None
            ("boue", t2)
          }
          else if (height < 300) {
            val t2 = if (type2Int < -200) Some("city")
                     else if (type2Int < -100) Some("forrest")
                     else if (type2Int < -50) Some("field")
                     else None
            ("plaine", t2)
          }
          else {
            val t2 = if (type2Int < -400) Some("city")
                     else if (type2Int < -200) Some("forrest")
                     else None
            ("montains", t2)
          }
        }
        Zone(
          Position(x*zonesDim.width, y*zonesDim.height),
          Dimension(zonesDim.width, zonesDim.height),
          ts = 0,
          infos = Zone.Infos(height, type1, type2, infection)
        )
      }
    Game(name, worldDim, zones)
  }

  def apply(name: String, worldDim: Dimension, zones: Seq[Zone]): Game =
    Game(name, worldDim, zones, List[Player]())

}
