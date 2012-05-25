package com.dohzya.gethomeback.models

import com.dohzya.gethomeback.libs.Generator

case class Game(
  name: String,
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
    name: String
  ): Game = {
    val gen = Generator(name)(_)
    val infectionGen = gen(0)
    val type1Gen = gen(1)
    val type2Gen = gen(2)
    val youthGen = gen(3)
    val zones = for(xx <- 0.to(80); yy <- 0.to(80))
      yield {
        val x = xx - 10; val y = yy - 10
        val infection = (infectionGen(x, y) * 100).abs.toInt
        val youth = (youthGen(x, y) * 100).abs.toInt * 10
        val height = (type1Gen(x, y) * 700 + 200).toInt * 2
        val (type1, type2) = {
          val type2Int = (type2Gen(x, y) * 1000).toInt
          if (height < 24) {
            val t2 = if (type2Int > 300) Some("city")
                     else None
            ("water", t2)
          }
          else if (height < 30) {
            val t2 = None
            ("swamp", t2)
          }
          else if (height < 600) {
            val t2 = if (type2Int < -200) Some("city")
                     else if (type2Int < -100) Some("forrest")
                     else if (type2Int < -50) Some("field")
                     else None
            ("plain", t2)
          }
          else {
            val t2 = if (type2Int < -400) Some("city")
                     else if (type2Int < -200) Some("forrest")
                     else if (height > 750) Some("mountains")
                     else None
            ("mountainous", t2)
          }
        }
        Zone(
          Position(x, y),
          Dimension(1000, 1000),
          ts = 0,
          infos = Zone.Infos(height, type1, type2, infection, youth)
        )
      }
    Game(name, zones)
  }

  def apply(name: String, zones: Seq[Zone]): Game =
    Game(name, zones, List[Player]())

}
