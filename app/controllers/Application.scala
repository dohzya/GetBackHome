package com.dohzya.gethomeback.controllers

import play.api._
import play.api.mvc._
import com.dohzya.gethomeback.models._

object Application extends Base {

  def index = Action { implicit request =>
    val game = Game(Dimension(height=600, width=800), Dimension(height=50, width=50))
    Ok(views.html.index(game))
  }

}
