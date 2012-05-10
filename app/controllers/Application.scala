package com.dohzya.gethomeback.controllers

import play.api._
import play.api.mvc._
import com.dohzya.gethomeback.models._

object Application extends Base {

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

}
