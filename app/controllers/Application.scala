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
    val seed = new java.util.Random(System.currentTimeMillis()).nextInt(1000000)
    println(seed)
    val zones = for(x <- 0.to(width/d); y <- 0.to(height/d))
      yield {
        val infection = SimplexNoise.noise(x, y, 0, seed).abs
        val typeInt = (SimplexNoise.noise(x, y, 1, seed)*100).toInt
        Zone(
          x = x*d,
          y = y*d,
          dx = d,
          dy = d,
          infos = Zone.Infos(
            zoneType = if (typeInt < 20) "plaine"
                       else if (typeInt < 40) "city"
                       else if (typeInt < 60) "field"
                       else if (typeInt < 80) "water"
                       else if (typeInt < 100) "boue"
                       else "",
            infection = infection
          )
        )
      }
    Ok(views.html.index(height, width, zones))
  }

}
