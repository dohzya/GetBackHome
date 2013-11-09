package controllers

import play.api.mvc._

object Application extends Controller {

  def main(url: String) = Action { implicit request =>
    Ok(views.html.templates.main())
  }

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

  def notFound(url: String) = Action {
    NotFound
  }

  def docRedirect = Action { Redirect(routes.Application.docIndex) }
  def doc(file: String) = controllers.Assets.at("/doc", file)
  def docIndex = doc("index.html")

}
