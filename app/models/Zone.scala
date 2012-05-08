package com.dohzya.gethomeback.models

import play.api.libs.json

case class Zone(
  x: Int,
  y: Int,
  dx: Int,
  dy: Int,
  infos: Zone.Infos
)
object Zone {

  case class Infos(
    zoneType: String,
    infection: Double
  )

}

object ZoneJsonFormatter {

  import play.api.libs.json._
  import play.api.libs.json.Json.toJson

  implicit object InfosFormatter extends json.Format[Zone.Infos] {
    def reads(json: JsValue) = Zone.Infos(
      zoneType = (json \ "zoneType").as[String],
      infection = (json \ "infection").as[Double]
    )

    def writes(o: Zone.Infos): JsValue = JsObject(List(
      "zoneType" -> JsString(o.zoneType),
      "infection" -> JsNumber(o.infection)
    ))
  }

  implicit object ZoneJsonFormatter extends json.Format[Zone] {
    def reads(json: JsValue) = Zone(
      (json \ "x").as[Int],
      (json \ "y").as[Int],
      (json \ "dx").as[Int],
      (json \ "dy").as[Int],
      (json \ "infos").as[Zone.Infos]
    )

    def writes(o: Zone): JsValue = JsObject(List(
      "x" -> JsNumber(o.x),
      "y" -> JsNumber(o.y),
      "dx" -> JsNumber(o.dx),
      "dy" -> JsNumber(o.dy),
        "infos" -> toJson(o.infos)
    ))
  }

}
