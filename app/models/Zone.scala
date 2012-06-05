package com.dohzya.getbackhome.models

import play.api.libs.json

case class Zone(
  pos: Position,
  dim: Dimension,
  infos: Zone.Infos,
  ts: Int
)
object Zone {

  case class Infos(
    height: Double,
    type1: String,
    type2: Option[String],
    infection: Int,
    youth: Int
  )

}

object ZoneJsonFormatter {

  import play.api.libs.json._
  import play.api.libs.json.Json.toJson

  import DimensionJsonFormatter._
  import PositionJsonFormatter._

  implicit object InfosFormatter extends Format[Zone.Infos] {
    def reads(json: JsValue) = Zone.Infos(
      height = (json \ "height").as[Double],
      type1 = (json \ "type1").as[String],
      type2 = (json \ "type2").asOpt[String],
      infection = (json \ "infection").as[Int],
      youth = (json \ "youth").as[Int]
    )

    def writes(o: Zone.Infos): JsValue = JsObject(List(
      "height" -> JsNumber(o.height),
      "type1" -> JsString(o.type1),
      "type2" -> o.type2.map(JsString(_)).getOrElse(JsNull),
      "infection" -> JsNumber(o.infection),
      "youth" -> JsNumber(o.youth)
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
