package com.dohzya.gethomeback.controllers

import play.api._
import play.api.mvc._
import com.dohzya.gethomeback._
import com.dohzya.gethomeback.models._
import com.dohzya.gethomeback.models.messages

import akka.actor._
import akka.pattern.ask
import akka.util.Timeout
import akka.util.duration._
import play.api.Play.current
import play.api.libs.concurrent._

object Game extends Base {

  implicit val timeout = Timeout(5 seconds)

  val player = Akka.system.actorOf(Props(new Player("Guest")), name = "player")

  def game(id: String) = Action { implicit request =>
    Async {
      val game = models.Game(id, Dimension(1000, 1000))
      (player ? messages.GetInfos).mapTo[Player.Infos].asPromise.map { playerInfos =>
        Ok(views.html.game(game, playerInfos))
      }
    }
  }

}
