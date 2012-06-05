package com.dohzya.getbackhome.controllers

import play.api._
import play.api.mvc._
import com.dohzya.getbackhome._
import com.dohzya.getbackhome.models._
import com.dohzya.getbackhome.models.messages._

import akka.actor._
import akka.pattern.ask
import akka.util.Timeout
import akka.util.duration._
import play.api.Play.current
import play.api.libs.concurrent._

object Game extends Base {

  implicit val timeout = Timeout(5 seconds)

  lazy val games = GameRegistry.actor
  lazy val players = PlayerRegistry.actor

  def index(id: String) = Action { implicit request =>
    Async {
      for (
        player <- getOrCreatePlayer("Guest");
        game <- getOrCreateGame(id);
        playerInfos <- (player ? GetInfos).mapTo[Player.Infos].asPromise;
        gameInfos <- (game ? GetInfos).mapTo[models.Game.Infos].asPromise
      ) yield {
        Ok(views.html.game(gameInfos, playerInfos))
      }
    }
  }

  def getOrCreateGame(id: String) = {
    (games ? GetInstance(id)).mapTo[Option[ActorRef]].asPromise.flatMap {
      case Some(game) => Promise.pure(game)
      case None => (games ? CreateGame(id)).mapTo[ActorRef].asPromise
    }
  }

  def getOrCreatePlayer(id: String) = {
    (players ? GetInstance(id)).mapTo[Option[ActorRef]].asPromise.flatMap {
      case Some(player) => Promise.pure(player)
      case None => (players ? CreatePlayer(id)).mapTo[ActorRef].asPromise
    }
  }

}
