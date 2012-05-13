package com.dohzya.gethomeback.controllers

import play.api._
import play.api.mvc._
import com.dohzya.gethomeback._
import com.dohzya.gethomeback.models._

object Game extends Base {

  def game(id: String) = Action { implicit request =>
    val dim = 50
    val game = models.Game(id, Dimension(height=600, width=800), Dimension(height=dim, width=dim))
    val player = game.player(session.get("playerName").getOrElse("Guest"))
    Ok(views.html.game(game, player)).withSession(
      session + ("playerName" -> player.name)
    )
  }

}
