package com.dohzya.gethomeback.controllers

import play.api._
import play.api.libs.iteratee._
import play.api.mvc._
import com.dohzya.gethomeback._
import com.dohzya.gethomeback.models._

object Game extends Base {

  var guestNb = 0
  var games = Map[String, Game]()
  var players = Map[String, Player]()

  def game(id: String) = Action { implicit request =>
    val game = getGame(id)
    val player = getPlayer
    Ok(views.html.game(game, player)).withSession(
      session + ("playerName" -> player.name)
    )
  }

  def getZone(id: String, x: Int, y: Int) = Action { implicit request =>
    val game = getGame(id)
    val player = getPlayer
    val zone = game(player, x, y)
    Ok(zone.toString).withSession(
      session + ("playerName" -> player.name)
    )
  }

  def ws = WebSocket.using[String] { request =>
    // Log events to the console
    val in = Iteratee.foreach[String](println).mapDone { _ =>
      println("Disconnected")
    }

    val toCaps = Enumeratee.map[String](_.toUpperCase)
    val sepBySpaces = Enumeratee.map[String](">>>" + _ + "<<<")

    // Send a single 'Hello!' message
    val out = Enumerator("Hello!")
    (toCaps ><> sepBySpaces &>> in, out)
  }

  def createGame(id: String) = {
    val dim = 20
    models.Game(id, Dimension(height=600, width=800), Dimension(height=dim, width=dim))
  }

  def getGame(id: String) = {
    games.get(id) match {
      case Some(g) => g
      case None =>
        val game = createGame(id)
        games = games + (id -> game)
        game
    }
  }
  def getPlayer(implicit request: RequestHeader) = {
    session.get("playerName").flatMap(players.get(_)) match {
      case Some(p) => p
      case None =>
        guestNb = guestNb + 1
        val name = "Guest" + guestNb
        val player = Player(name)
        players = players + (name -> player)
        player
    }
  }

}
