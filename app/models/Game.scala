package com.dohzya.getbackhome.models

import akka.actor._
import akka.pattern.ask
import akka.util.Timeout
import akka.util.duration._
import play.api.Play.current
import play.api.libs.concurrent._
import com.dohzya.getbackhome.libs.Generator

class Game(
  val name: String,
  val zones: Seq[Zone]
) extends Actor {

  play.api.Logger.debug("Creating game "+ name+ "…")

  import Game._

  def receive = {
    case messages.GetInfos => sender ! infos
  }

  def infos = Infos(name, zones)

}
object Game {

  def apply(
    name: String,
    zoneDims: Dimension
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
          zoneDims,
          ts = 0,
          infos = Zone.Infos(height, type1, type2, infection, youth)
        )
      }
    new Game(name, zones)
  }

  case class Infos(name: String, zones: Seq[Zone])

}

class GameRegistry extends Actor {

  var instances = Map.empty[String, ActorRef]

  def receive = {
    case messages.GetInstance(name) => sender ! getInstance(name)
    case messages.CreateGame(name, zoneDims) => sender ! createInstance(name, zoneDims)
  }

  def getInstance(name: String) = instances.get(name)

  def createInstance(name: String, zoneDims: Dimension) = {
    val ref = context.actorOf(Props(Game(name, zoneDims)), name)
    instances = instances + (name -> ref)
    ref
  }

}
object GameRegistry {

  lazy val actor = try {
    Akka.system.actorOf(Props[GameRegistry], "games")
  } catch {
    case _ => Akka.system.actorFor("games")
  }

}
