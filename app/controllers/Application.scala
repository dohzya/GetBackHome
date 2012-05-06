package com.dohzya.gethomeback.controllers

import play.api._
import play.api.mvc._
import com.dohzya.gethomeback.models._

object Application extends Controller {

  def index = Action { implicit request =>
    val zones = Seq(
      Zone(
        x = 50,
        y = 50,
        dx = 50,
        dy = 50,
        color = "red",
        infos = Zone.Infos(zoneType = "montains")
      ),
      Zone(
        x = 200,
        y = 200,
        dx = 50,
        dy = 50,
        color = "blue",
        infos = Zone.Infos(zoneType = "city")
      )
    )
    Ok(views.html.index(zones))
  }

}
