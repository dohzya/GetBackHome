package com.dohzya.getbackhome.controllers

import play.api._
import play.api.mvc._
import com.dohzya.getbackhome.models._

object Application extends Base {

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

}
