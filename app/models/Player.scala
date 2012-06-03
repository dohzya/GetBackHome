package com.dohzya.gethomeback.models

import akka.actor._
import akka.pattern.ask
import akka.util.Timeout
import akka.util.duration._
import play.api.Play.current
import play.api.libs.concurrent._

class Player(name: String) extends Actor {

  import Player._

  def receive = {
    case messages.GetInfos => sender ! infos
  }

  def infos = Infos(name)

}
object Player {

  case class Infos(name: String)

}

class PlayerRegistry extends Actor {

  var instances = Map.empty[String, ActorRef]

  def receive = {
    case messages.GetInstance(name) => sender ! getInstance(name)
    case messages.CreatePlayer(name) => sender ! createInstance(name)
  }

  def getInstance(name: String) = instances.get(name)

  def createInstance(name: String) = {
    val ref = context.actorOf(Props(new Player(name)), name)
    instances = instances + (name -> ref)
    ref
  }

}
object PlayerRegistry {

  lazy val actor = try {
    Akka.system.actorOf(Props[PlayerRegistry], "players")
  } catch {
    case _ => Akka.system.actorFor("players")
  }

}
