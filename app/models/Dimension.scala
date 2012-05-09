package com.dohzya.gethomeback.models

case class Dimension(height: Int, width: Int)

object DimensionJsonFormatter {

  import play.api.libs.json._

  implicit object DimensionFormatter extends Format[Dimension] {
    def reads(json: JsValue) = Dimension(
      height = (json \ "height").as[Int],
      width = (json \ "width").as[Int]
    )

    def writes(o: Dimension): JsValue = JsObject(List(
      "height" -> JsNumber(o.height),
      "width" -> JsNumber(o.width)
    ))
  }

}
