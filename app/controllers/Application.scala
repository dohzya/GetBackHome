package com.dohzya.gethomeback.controllers

import play.api._
import play.api.mvc._
import com.dohzya.gethomeback.libs._
import com.dohzya.gethomeback.models._

object Application extends Controller {

  val height = 600
  val width = 800

  def index = Action { implicit request =>

    val d = 50
    val seed = new java.util.Random(System.currentTimeMillis()).nextInt(100000);
    val zones = for(x <- 0.to(width, d); y <- 0.to(height, d))
     yield Zone(
       x = x,
       y = y,
       dx = d,
       dy = d,
       infos = Zone.Infos(
         zoneType = "montains",
         infection = SimplexNoise.noise(x+seed, y+seed)
       )
     )
    Ok(views.html.index(height, width, zones))
  }

}
