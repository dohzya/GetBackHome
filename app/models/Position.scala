package com.dohzya.getbackhome.models

case class Position(x: Int, y: Int)

object PositionJsonFormatter {

  import play.api.libs.json._

  implicit object PositionFormatter extends Format[Position] {
    def reads(json: JsValue) = Position(
      x = (json \ "x").as[Int],
      y = (json \ "y").as[Int]
    )

    def writes(o: Position): JsValue = JsObject(List(
      "x" -> JsNumber(o.x),
      "y" -> JsNumber(o.y)
    ))
  }

}
