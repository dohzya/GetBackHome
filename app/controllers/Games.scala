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

object Games extends Base {

  implicit val timeout = Timeout(5 seconds)

  lazy val games = GameRegistry.actor
  lazy val players = PlayerRegistry.actor

  def index = Action { implicit request =>
    Async {
      getGames.map { games =>
        Ok(views.html.index(games.keys.toSeq))
      }
    }
  }

  def create = Action { implicit request =>
    Async {
      val name = request.body.asFormUrlEncoded.get.get("name").flatMap(_.headOption).getOrElse("Default")
      (games ? CreateGame(name)).mapTo[Option[ActorRef]].asPromise map { _ =>
        Redirect(routes.Games.show(name))
      }
    }
  }

  def show(id: String) = Action { implicit request =>
    Async {
      getOrCreatePlayer("Guest").flatMap { player =>
        getGame(id).flatMap {
          _ match {
            case Some(game) => {
              for (
                playerInfos <- (player ? GetInfos).mapTo[Player.Infos].asPromise;
                gameInfos <- (game ? GetInfos).mapTo[Game.Infos].asPromise
              ) yield {
                Ok(views.html.game(gameInfos, playerInfos))
              }
            }
            case None => Promise.pure { Redirect(routes.Application.index) }
          }
        }
      }
    }
  }

  def getGames: Promise[Map[String, ActorRef]] =
    (games ? GetInstances).mapTo[Map[String, ActorRef]].asPromise

  def getGame(id: String): Promise[Option[ActorRef]] =
    (games ? GetInstance(id)).mapTo[Option[ActorRef]].asPromise

  def getOrCreatePlayer(id: String): Promise[ActorRef] = {
    (players ? GetInstance(id)).mapTo[Option[ActorRef]].asPromise.flatMap {
      case Some(player) => Promise.pure(player)
      case None => (players ? CreatePlayer(id)).mapTo[Option[ActorRef]].asPromise.map(_.get)
    }
  }

}
