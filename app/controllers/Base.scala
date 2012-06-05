package com.dohzya.getbackhome.controllers

import play.api._
import play.api.mvc._

trait Base extends Controller {

  def logger = play.api.Logger("application")
  def debug(o: Any) = logger.debug(o.toString)

}
