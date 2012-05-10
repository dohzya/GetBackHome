package com.dohzya.gethomeback.models

import play.api.libs.json

case class Zone(
  pos: Position,
  dim: Dimension,
  infos: Zone.Infos,
  ts: Int
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

  import DimensionJsonFormatter._
  import PositionJsonFormatter._

  implicit object InfosFormatter extends Format[Zone.Infos] {
    def reads(json: JsValue) = Zone.Infos(
      zoneType = (json \ "zoneType").as[String],
      infection = (json \ "infection").as[Double]
    )

    def writes(o: Zone.Infos): JsValue = JsObject(List(
      "zoneType" -> JsString(o.zoneType),
      "infection" -> JsNumber(o.infection)
    ))
  }

  implicit object ZoneJsonFormatter extends Format[Zone] {
    def reads(json: JsValue) = Zone(
      pos = json.as[Position],
      dim = json.as[Dimension],
      ts = (json \ "ts").as[Int],
      infos = (json \ "infos").as[Zone.Infos]
    )

    def writes(o: Zone): JsValue = JsObject(List(
      "x" -> JsNumber(o.pos.x),
      "y" -> JsNumber(o.pos.y),
      "height" -> JsNumber(o.dim.height),
      "width" -> JsNumber(o.dim.width),
      "ts" -> JsNumber(o.ts),
      "infos" -> toJson(o.infos)
    ))
  }

}
