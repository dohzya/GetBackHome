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
